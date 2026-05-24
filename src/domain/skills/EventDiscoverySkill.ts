import { GoogleGenAI } from '@google/genai';
import { logger } from '../../lib/logger.js';
import { MonitorEventRepository } from '../../infrastructure/repositories/MonitorEventRepository.js';
import { EventMonitorConfigRepository } from '../../infrastructure/repositories/EventMonitorConfigRepository.js';
import { MonitorEvent, EVENT_TAXONOMY } from '../../models/index.js';
import crypto from 'crypto';

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
    
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('GEMINI_API_KEY is missing');
      
      const ai = new GoogleGenAI({ apiKey });
      
      const tzOffset = new Date().getTimezoneOffset();
      const collectionDate = new Date().toISOString();

      const systemInstruction = `Você é um assistente pesquisador especializado em encontrar eventos profissionais. 
Retorne APENAS um JSON válido. Não inclua Markdown (como \`\`\`json).
Você deve utilizar as informações da Busca do Google.

Regras de Filtragem e Higienização:
1. Agnosticismo de Plataforma e Varredura Ampla.
2. Formatar as datas em ISO8601.
3. Não inventar ou deduzir informações. Use os dados da pesquisa.
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
Data de coleta: ${collectionDate}

Tente evitar os seguintes eventos (deduplicação): ${ignoreHashes.join(', ')}

Pesquise eventos na web (Sympla, Eventbrite, Meetup, Comunidades) futuros, focados nos temas acima e retorne o JSON estruturado OBRIGATORIAMENTE.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2, // Low temperature for extraction
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });
      
      const rawResponse = response.text || '';

      try {
        const { UsageRepository } = await import('../../infrastructure/repositories/UsageRepository.js');
        const usageRepo = new UsageRepository();
        await usageRepo.saveUsage('system-event-discovery', {
          model: 'gemini-2.5-flash',
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata?.totalTokenCount || 0,
          context: 'event_discovery'
        });
      } catch (usageError) {
        logger.error('Failed to log usage for EventDiscoverySkill', { error: usageError });
      }
      
      let parsedResponse: any;
      try {
        parsedResponse = JSON.parse(rawResponse);
      } catch (parseError) {
        // Fallback for markdown stripping just in case
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
      logger.error('EventDiscoverySkill: Search failed', { error });
      return [];
    }
  }

  async runGlobalDiscoveryJob() {
    logger.info('EventDiscoverySkill: Starting global discovery job');
    // Coleta eventos dos últimos 7 dias para evitar duplicatas completas
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7);
    const recentEvents = await this.repository.findRecentEvents(recentDate);
    const recentHashes = recentEvents.map(e => e.hash);

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
      await this.repository.saveBatch(allNewEvents);
    }
    
    logger.info('EventDiscoverySkill: Job completed', { newEvents: allNewEvents.length });
    return allNewEvents;
  }
}
