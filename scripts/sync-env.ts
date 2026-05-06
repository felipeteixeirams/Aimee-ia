import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

/**
 * Script para ler o config-map.yaml e gerar comandos Vercel CLI
 * ou exportar variáveis.
 */

const CONFIG_PATH = path.join(process.cwd(), 'config-map.yaml');

function sync() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      console.error('❌ Arquivo config-map.yaml não encontrado!');
      return;
    }

    const fileContents = fs.readFileSync(CONFIG_PATH, 'utf8');
    const config: any = yaml.load(fileContents);

    const vars = config.data || {};
    const keys = Object.keys(vars);

    console.log('\n📦 CONFIGMAP DETECTADO (' + keys.length + ' variáveis)\n');
    console.log('--- Comandos para sincronizar (Copie e Cole no terminal local) ---');
    
    keys.forEach(key => {
      const value = vars[key];
      // Gera comando para adicionar na Vercel (Produção e Preview)
      // Usamos -f para forçar (overwrite se já existir)
      console.log(`vercel env add ${key} "${value}" production --force`);
      console.log(`vercel env add ${key} "${value}" preview --force`);
    });

    console.log('\n--- Para utilizar no desenvolvimento local ---');
    console.log('Execute: npm run env:local\n');

  } catch (e) {
    console.error('❌ Erro ao processar YAML:', e);
  }
}

sync();
