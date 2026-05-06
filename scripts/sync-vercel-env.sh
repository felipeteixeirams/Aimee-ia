#!/bin/bash

# Script para Sincronizar Variáveis de Ambiente com a Vercel (Simulando Kustomize)
# Uso: chmod +x scripts/sync-vercel-env.sh && ./scripts/sync-vercel-env.sh

echo "🚀 Iniciando sincronização de variáveis com a Vercel..."

# Função para adicionar variável
add_var() {
  local key=$1
  local value=$2
  if [ -n "$value" ]; then
    echo "Adding $key..."
    # vercel env add $key production "$value" <<< "y"
    # vercel env add $key preview "$value" <<< "y"
    echo "Comando: vercel env add $key <valor> production"
  fi
}

# Variáveis Firebase (Públicas/Não Sensíveis)
add_var "VITE_FIREBASE_AUTH_DOMAIN" "aimee-db9b3.firebaseapp.com"
add_var "VITE_FIREBASE_PROJECT_ID" "aimee-db9b3"
add_var "VITE_FIREBASE_STORAGE_BUCKET" "aimee-db9b3.firebasestorage.app"
add_var "VITE_FIREBASE_MESSAGING_SENDER_ID" "317073273380"
add_var "VITE_FIREBASE_APP_ID" "1:317073273380:web:c87faeeaf141201e5c1eb1"
add_var "VITE_FIREBASE_DATABASE_ID" "ai-studio-a42d197f-b2fd-4ea3-b5d9-b3b02ea6b201"

# Variáveis do Servidor (Não Sensíveis)
add_var "FIREBASE_PROJECT_ID" "aimee-db9b3"
add_var "APP_URL" "https://aimee-ia.vercel.app"
add_var "PORT" "3000"

echo "✅ Script finalizado. Lembre-se de configurar as chaves SENSÍVEIS (API Keys) manualmente no painel da Vercel."
