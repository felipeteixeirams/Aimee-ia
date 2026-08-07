import { GoogleGenAI } from '@google/genai';
import { config } from '../../lib/config.js';
import { CircuitBreaker } from '../CircuitBreaker.js';
import { ReceiptExtractionSchema, ReceiptExtraction, VisionRequest } from '../../models/index.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { logger } from '../../lib/logger.js';
import { TransactionRepository } from '../../infrastructure/repositories/TransactionRepository.js';
import { TaskRepository } from '../../infrastructure/repositories/TaskRepository.js';

export class VisionService {
  private genAI: GoogleGenAI;
  private breaker: CircuitBreaker;
  private transactionRepo: TransactionRepository;
  private taskRepo: TaskRepository;

  constructor() {
    this.genAI = new GoogleGenAI({ apiKey: config.geminiApiKey });
    this.breaker = new CircuitBreaker(3, 30000);
    this.transactionRepo = new TransactionRepository();
    this.taskRepo = new TaskRepository();
  }

  public async processReceipt(request: VisionRequest): Promise<ReceiptExtraction> {
    return this.breaker.fire(async () => {
      try {
        const response = await this.genAI.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: 'Extraia os itens, valores, e classifique-os a partir deste cupom fiscal ou nota fiscal de supermercado. Retorne estritamente um JSON de acordo com o esquema solicitado.'
                },
                {
                  inlineData: {
                    data: request.imagePayloadBase64,
                    mimeType: request.mimeType
                  }
                }
              ]
            }
          ],
          config: {
            responseMimeType: 'application/json',
            responseSchema: zodToJsonSchema(ReceiptExtractionSchema as any) as any,
          }
        });

        const text = response.text;
        if (!text) throw new Error('Empty response from AI model');

        const parsed = JSON.parse(text);
        if (typeof parsed.confidenceScore !== 'number') {
          parsed.confidenceScore = 0.9;
        }

        const extraction = ReceiptExtractionSchema.parse(parsed);

        // 7. Backend insere registro financeiro no Firestore (Gasto total)
        await this.transactionRepo.create({
          description: `Compras em ${extraction.merchantName}`,
          amount: extraction.totalAmount,
          type: 'expense',
          category: 'Supermercado',
          date: new Date().toISOString()
        }, request.userId);

        // 7. Marca itens da lista de compras como concluídos se houver match
        const tasks = await this.taskRepo.list([], request.userId);
        const shoppingTasks = tasks.filter(t => t.category === 'errand' && t.status === 'todo');

        for (const item of extraction.items) {
          const lowerName = item.name.toLowerCase();
          const match = shoppingTasks.find(t => 
            lowerName.includes(t.title.toLowerCase()) || 
            t.title.toLowerCase().includes(lowerName)
          );
          if (match && match.id) {
            await this.taskRepo.update(match.id, { status: 'done' }, request.userId);
          }
        }

        return extraction;
      } catch (error) {
        logger.error('Error processing receipt in VisionService', { error });
        throw error;
      }
    });
  }
}


