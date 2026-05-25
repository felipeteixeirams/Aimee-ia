import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import { logger } from '../../lib/logger.js';
import { MonitorEventRepository } from '../../infrastructure/repositories/MonitorEventRepository.js';
import { EventMonitorConfigRepository } from '../../infrastructure/repositories/EventMonitorConfigRepository.js';
import { MonitorEvent, EVENT_TAXONOMY } from '../../models/index.js';
import crypto from 'crypto';
import { config } from '../../lib/config.js';
import { getAdminFirestore } from '../../infrastructure/server/firebaseAdmin.js';

export class EventDiscoverySkill {
  private repository: MonitorEventRepository;
  private configRepo: EventMonitorConfigRepository;

  constructor() {
    this.repository = new MonitorEventRepository();
    this.configRepo = new EventMonitorConfigRepository();
  }

  /**
   * Search for events based on interests, ignoring existing hashes.
   */
  async searchEvents(query: string, interests: string[], ignoreHashes: string[]): Promise<MonitorEvent[]> {
    logger.info('EventDiscoverySkill: Searching for events', { query, interests });
    
    let rawResponse = '';
    let usedModel = '';
    let promptTokenCount = 0;
    let candidatesTokenCount = 0;
    let totalTokenCount = 0;

    const systemInstruction = `Você é um assistente pesquisador especializado em encontrar eventos profissionais. 
Retorne APENAS um JSON válido. Não inclua Markdown (como \`\`\`json) ou textos adicionais de introdução/conclusão.

Regras de Filtragem e Higienização:
1. Agnosticismo de Plataforma e Varredura Ampla.
2. Formatar as datas em ISO8601.
3. Não inventar ou deduzir informações.
4. NUNCA DEVOLVA JSON INVÁLIDO.

Formato OBRIGATÓRIO de Saída:
{
  "events": [
    {
      "titulo": "string",
      "resumo": "string (1-2 frases)",
      "categorias": ["string"],
      "publico_alvo": "string",
      "data_inicio": "ISO8601",
      "data_fim": "ISO8601",
      "horario": "string",
      "formato": "presencial" | "online" | "hibrido" | "desconhecido",
      "local": "string",
      "idioma": "string",
      "custo": 0,
      "moeda": "BRL",
      "link_inscricao": "url",
      "link_fonte_origem": "url",
      "organizador": "string",
      "fonte": "dominio",
      "free_text_tags": ["string"],
      "tecnologias_mencionadas": ["string"],
      "foco_tecnico": ["string"],
      "raw_excerpt": "trecho curto"
    }
  ]
}
`;

    const prompt = `
Tema: "${query}"
Interesses do usuário: ${interests.join(', ')}
Data de coleta: ${new Date().toISOString()}

Tente evitar os seguintes eventos (deduplicação): ${ignoreHashes.join(', ')}

Foque em listar eventos futuros conhecidos reais em comunidades de tecnologia (como Meetups, Sympla, etc.) relacionados a essa pesquisa no Brasil.
Retorne o JSON estritamente formatado de acordo com a instrução de saída.
`;

    // 1. Tentar com Gemini se configurado
    if (config.geminiApiKey) {
      try {
        usedModel = 'gemini-2.5-flash';
        const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
        
        const response = await ai.models.generateContent({
          model: usedModel,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.2, // Baixa temperatura para melhor extração estruturada
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json"
          }
        });
        
        rawResponse = response.text || '';
        promptTokenCount = response.usageMetadata?.promptTokenCount || 0;
        candidatesTokenCount = response.usageMetadata?.candidatesTokenCount || 0;
        totalTokenCount = response.usageMetadata?.totalTokenCount || 0;

        logger.info('EventDiscoverySkill: Gemini API response and usage captured', {
          model: usedModel,
          promptTokenCount,
          candidatesTokenCount,
          totalTokenCount
        });
      } catch (geminiError: any) {
        logger.warn('EventDiscoverySkill: Gemini search failed, checking fallbacks...', { error: geminiError.message });
      }
    }

    // 2. Fallback para DeepSeek se Gemini não disponível ou falhou
    if (!rawResponse && config.deepseekApiKey) {
      try {
        usedModel = 'deepseek-chat';
        logger.info('EventDiscoverySkill: Trying fallback discovery with DeepSeek', { model: usedModel });
        
        const openai = new OpenAI({
          apiKey: config.deepseekApiKey,
          baseURL: "https://api.deepseek.com"
        });

        const completion = await openai.chat.completions.create({
          model: usedModel,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        });

        rawResponse = completion.choices[0].message.content || '';
        promptTokenCount = completion.usage?.prompt_tokens || 0;
        candidatesTokenCount = completion.usage?.completion_tokens || 0;
        totalTokenCount = completion.usage?.total_tokens || 0;

        logger.info('EventDiscoverySkill: DeepSeek API response and usage captured', {
          model: usedModel,
          promptTokenCount,
          candidatesTokenCount,
          totalTokenCount
        });
      } catch (dsError: any) {
        logger.warn('EventDiscoverySkill: DeepSeek search fallback failed...', { error: dsError.message });
      }
    }

    // 3. Fallback para OpenAI se os anteriores não disponíveis ou falharam
    if (!rawResponse && config.openaiApiKey) {
      try {
        usedModel = 'gpt-4o';
        logger.info('EventDiscoverySkill: Trying fallback discovery with OpenAI', { model: usedModel });
        
        const openai = new OpenAI({
          apiKey: config.openaiApiKey
        });

        const completion = await openai.chat.completions.create({
          model: usedModel,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        });

        rawResponse = completion.choices[0].message.content || '';
        promptTokenCount = completion.usage?.prompt_tokens || 0;
        candidatesTokenCount = completion.usage?.completion_tokens || 0;
        totalTokenCount = completion.usage?.total_tokens || 0;

        logger.info('EventDiscoverySkill: OpenAI API response and usage captured', {
          model: usedModel,
          promptTokenCount,
          candidatesTokenCount,
          totalTokenCount
        });
      } catch (oaiError: any) {
        logger.error('EventDiscoverySkill: OpenAI search fallback failed', { error: oaiError.message });
      }
    }

    if (!rawResponse) {
      logger.error('EventDiscoverySkill: All LLM discovery options failed or are unconfigured.');
      return [];
    }

    // Registrar o uso auditado exato das LLMs
    try {
      const { UsageRepository } = await import('../../infrastructure/repositories/UsageRepository.js');
      const usageRepo = new UsageRepository();
      await usageRepo.logUsage({
        userId: 'system-event-discovery',
        model: usedModel,
        promptTokens: promptTokenCount,
        completionTokens: candidatesTokenCount,
        totalTokens: totalTokenCount,
        context: 'event_discovery'
      });
    } catch (usageError) {
      logger.error('Failed to log usage for EventDiscoverySkill', { error: usageError });
    }
    
    try {
      let parsedResponse: any;
      try {
        parsedResponse = JSON.parse(rawResponse);
      } catch (parseError) {
        // Fallback para strip de tags markdown caso tenham sido incluídas incorretamente
        const stripped = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedResponse = JSON.parse(stripped);
      }
      
      if (!parsedResponse.events || !Array.isArray(parsedResponse.events)) {
        logger.warn('EventDiscoverySkill: Invalid JSON structure returned by LLM', { rawResponse });
        return [];
      }
      
      const events: MonitorEvent[] = [];
      const timestamp = new Date().toISOString();
      
      for (const rawEvent of parsedResponse.events) {
        const hashContext = `${rawEvent.titulo}-${rawEvent.data_inicio}-${rawEvent.fonte}`;
        const hash = crypto.createHash('md5').update(hashContext).digest('hex');
        
        events.push({
          hash,
          title: rawEvent.titulo || 'Evento Sem Título',
          summary: rawEvent.resumo || '',
          categories: Array.isArray(rawEvent.categorias) ? rawEvent.categorias : [],
          targetAudience: rawEvent.publico_alvo,
          startDate: rawEvent.data_inicio,
          endDate: rawEvent.data_fim,
          time: rawEvent.horario,
          format: rawEvent.formato && ['presencial', 'online', 'hibrido', 'desconhecido'].includes(rawEvent.formato.toLowerCase()) 
            ? rawEvent.formato.toLowerCase() as any 
            : 'desconhecido',
          location: rawEvent.local,
          language: rawEvent.idioma,
          cost: rawEvent.custo ? Number(rawEvent.custo) : 0,
          currency: rawEvent.moeda || 'BRL',
          registrationLink: rawEvent.link_inscricao,
          sourceLink: rawEvent.link_fonte_origem,
          organizer: rawEvent.organizador,
          source: rawEvent.fonte || 'Desconhecido',
          freeTextTags: Array.isArray(rawEvent.free_text_tags) ? rawEvent.free_text_tags : [],
          mentionedTechs: Array.isArray(rawEvent.tecnologias_mencionadas) ? rawEvent.tecnologias_mencionadas : [],
          techFocus: Array.isArray(rawEvent.foco_tecnico) ? rawEvent.foco_tecnico : [],
          collectedAt: timestamp,
          confidence: 0.9,
          rawExcerpt: rawEvent.raw_excerpt
        });
      }
      
      logger.info('EventDiscoverySkill: Events discovered', { count: events.length });
      return events;

    } catch (error) {
      logger.error('EventDiscoverySkill: Search failed to parse or construct events', { error });
      return [];
    }
  }

  async runGlobalDiscoveryJob() {
    logger.info('EventDiscoverySkill: Starting global discovery job');
    // Coleta eventos dos últimos 7 dias para evitar duplicatas completas
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7);
    
    let recentHashes: string[] = [];
    const adminDb = getAdminFirestore();

    if (adminDb) {
      try {
        const snapshot = await adminDb.collection('monitor_events')
          .where('collectedAt', '>=', recentDate.toISOString())
          .get();
        recentHashes = snapshot.docs.map(d => d.id);
      } catch (err) {
         logger.error('Admin DB failed to read recent events', { error: err });
         const recentEvents = await this.repository.findRecentEvents(recentDate);
         recentHashes = recentEvents.map(e => e.hash);
      }
    } else {
      const recentEvents = await this.repository.findRecentEvents(recentDate);
      recentHashes = recentEvents.map(e => e.hash);
    }

    // Get all interests from taxonomy, just to populate cache
    // Let's do a couple of broad queries
    const broadQueries = [
      "IA generativa, agentes, RAG, LLMs Brasil",
      "Meetup React Node frontend backend programação"
    ];

    let allNewEvents: MonitorEvent[] = [];

    for (const query of broadQueries) {
      const searched = await this.searchEvents(query, [], recentHashes);
      allNewEvents = [...allNewEvents, ...searched];
    }

    if (allNewEvents.length > 0) {
      if (adminDb) {
        try {
          const batch = adminDb.batch();
          allNewEvents.forEach(event => {
            const docRef = adminDb.collection('monitor_events').doc(event.hash);
            batch.set(docRef, event, { merge: true });
          });
          await batch.commit();
        } catch (err) {
          logger.error('Admin DB failed to write new events', { error: err });
          await this.repository.saveBatch(allNewEvents);
        }
      } else {
        await this.repository.saveBatch(allNewEvents);
      }
    }
    
    logger.info('EventDiscoverySkill: Job completed', { newEvents: allNewEvents.length });
    return allNewEvents;
  }
}
