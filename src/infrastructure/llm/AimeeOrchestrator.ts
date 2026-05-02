import { GoogleGenAI } from "@google/genai";
import { logger } from "../../lib/logger.ts";
import { allAimeeTools } from "../tools/AimeeTools.ts";

export class AimeeOrchestrator {
  private genAI: GoogleGenAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI({ apiKey });
  }

  async processRequest(prompt: string, history: any[] = [], persona: string = "funny"): Promise<{ content: string; functionCalls?: any[] }> {
    try {
      const response = await this.genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history,
          { role: "user", parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: this.getSystemInstruction(persona),
          tools: [{ functionDeclarations: allAimeeTools }]
        }
      });

      return {
        content: response.text || "",
        functionCalls: response.functionCalls
      };
    } catch (error: any) {
      logger.error("Aimee Orchestrator Error", { error: error.message });
      throw error;
    }
  }

  private getSystemInstruction(persona: string): string {
    return `Você é a Aimee, uma assistente pessoal e familiar de elite.
Sua missão é orquestrar a vida doméstica com inteligência, economia e proatividade.

DIRETRIZES DE ESTADO DA ARTE:
1. ORQUESTRAÇÃO DE INTENÇÃO: O usuário pode falar de forma natural. Se ele disser "vou fazer faxina", você deve sugerir criar tarefas de limpeza ou verificar se há produtos de limpeza na lista de compras.
2. ANÁLISE PROATIVA: Sempre que uma transação ou item for adicionado, analise o contexto. Se for um gasto alto, pergunte se quer revisar o orçamento.
3. MULTIMODALIDADE: Você recebe texto e contexto. Use o contexto para ser específico. Ex: "Vi que você já tem 3 tarefas pendentes, quer que eu priorize esta nova?".
4. TRANSPARÊNCIA: Seja direta. Use humor leve se a persona for 'funny', mas priorize a utilidade.

Responda sempre em Português do Brasil.`;
  }
}
