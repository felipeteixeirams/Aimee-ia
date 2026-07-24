# 📝 Spec: Etapa 12 - Processamento Multimodal e OCR Inteligente (Vision)

**Autor:** AI Coding Agent / Arquiteto de Software Sênior
**Status:** 🏗️ Spec Phase (Aguardando Aprovação)
**Data:** 24 de Julho

---

## 1. Objetivo Geral
Permitir que os usuários enviem fotos de cupons fiscais e notas de supermercado (via câmera ou upload) para que a Aimee (usando Gemini Vision) processe, classifique e extraia os itens automaticamente. Isso elimina o atrito do registro manual de compras e gastos, alimentando os painéis `FinanceView` e deduzindo/atualizando o `ShoppingView`.

## 2. Escopo
*   **Interface (PWA):** Componente de upload/câmera integrado ao `ChatView` ou em um modal global, com feedback visual de processamento (Skeletons/Spinners).
*   **Serviço Backend:** Endpoint `/api/vision` responsável por receber a imagem (Base64) e processá-la usando a SDK do Google Gen AI (Gemini Vision).
*   **Integração de Domínio:** Parse estruturado da resposta do Gemini para injetar os dados diretamente no `TransactionRepository` (Financeiro) e `TaskRepository/ItemRepository` (Compras).
*   **Resiliência (Circuit Breaker):** Implementação do padrão Circuit Breaker no client e no server para lidar com falhas da API do Gemini, degradações temporárias ou *rate limits*, provendo fallbacks graciosos (ex: enfileiramento offline ou modo de extração manual assistida).
*   **Rastreabilidade:** Logs estruturados no backend para métricas de tempo de inferência e sucesso/falha do OCR.

## 3. Fora do Escopo
*   Arquivamento legal de documentos em bucket (Google Cloud Storage) a longo prazo. O processamento será *ephemeral* (a imagem trafega em base64, é analisada em RAM no servidor e descartada, persistindo apenas os metadados JSON extraídos). O arquivamento via bucket ficará para uma fase futura se houver necessidade real.
*   Leitura de faturas complexas de PDF multipáginas. O foco é em cupons fiscais (PNG/JPEG).

## 4. Arquitetura
*   **Frontend (`src/client`):** 
    *   Novo gancho: `useVisionProcessor.ts`
    *   Componentes UI: `CameraCapture.tsx`, `ReceiptPreviewModal.tsx`
*   **Backend (`src/server`):**
    *   `VisionService.ts` (Serviço de Domínio)
    *   `CircuitBreaker.ts` (Implementação de resiliência: Open, Half-Open, Closed).
*   **AI Tools (`AimeeTools.ts`):** Adição de tool `processReceipt` ou fallback para estruturação de resposta via `responseSchema`.

## 5. Contratos (Schemas Zod)
```typescript
// Contrato de Resposta da API do Gemini (Vision)
export const ReceiptExtractionSchema = z.object({
  merchantName: z.string(),
  totalAmount: z.number(),
  date: z.string(),
  items: z.array(z.object({
    name: z.string(),
    price: z.number(),
    category: z.enum(['Alimentação', 'Higiene', 'Limpeza', 'Outros'])
  })),
  confidenceScore: z.number().min(0).max(1)
});

// Contrato da API Backend
export const VisionRequestSchema = z.object({
  imagePayloadBase64: z.string(),
  mimeType: z.string() // image/jpeg, image/png
});
```

## 6. Fluxo
1. Usuário tira foto do cupom pelo PWA.
2. A imagem é comprimida localmente via Canvas API para reduzir payload (< 2MB).
3. Payload vai para `/api/vision` via hook com tratamento de timeout.
4. Backend submete ao Circuit Breaker. Se "Closed" (Tudo OK), chama Gemini Vision.
5. Gemini retorna JSON estrito usando `responseSchema`.
6. Backend valida JSON com Zod.
7. Backend insere registro financeiro no Firestore (Gasto total) e marca itens da lista de compras como concluídos se houver match probabilístico.
8. Frontend notifica usuário do sucesso com sumário animado.

## 7. Corner Cases e Resiliência (Circuit Breaker)
*   **Rate Limits (429) ou Falha da IA (503):** 
    *   O Circuit Breaker abre (estado `Open`). 
    *   A API backend retorna status 503 com erro customizado `AI_SERVICE_DEGRADED`.
    *   O Frontend intercepta amigavelmente: *"Aimee está processando muitos cupons agora. Salvamos sua foto localmente e tentaremos novamente em breve."* (Gravação no IndexedDB/PWA offline sync).
*   **Foto Ilegível / Baixa Confiança:** O Gemini pode não conseguir ler a foto. O `confidenceScore` baixo aciona um fluxo manual de fallback, onde a imagem é exibida ao lado de um formulário pré-preenchido para o usuário revisar os valores e completar.
*   **Payload Gigante:** Rejeição imediata (HTTP 413) no Fastify; o client deve fazer downscale preventivo.

## 8. Critérios de Aceite
*   [x] Compressão local via Canvas reduzindo imagens para < 2MB antes do upload.
*   [x] O Circuit Breaker deve barrar chamadas após 3 erros consecutivos e tentar Half-Open após 30 segundos.
*   [x] Parse determinístico de nota fiscal retornando JSON tipado e gravando no Firestore via Repositories.
*   [x] Fallback UX explícito sem travar a interface ("graceful degradation").
*   [x] Ausência total de arquivos salvos em disco do servidor (processamento in-memory seguro).
