import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const skipTests = process.env.SKIP_TESTS === 'true' || process.env.SKIP_BUILD_TESTS === 'true';

console.log('🚀 \x1b[36mIniciando Orquestrador de Build Otimizado (Aimee AI)...\x1b[0m');
console.log(`- Modo: Execução em Paralelo (Paralelismo Máximo Habilitado ⚡)`);
console.log(`- Pular Testes: ${skipTests ? '✅ Ativado' : '❌ Desativado (Testes rodarão em paralelo)'}`);

function verifyNoDeprecatedImports() {
  console.log('🔍 \x1b[36m[Safety-Check]\x1b[0m Analisando código em busca de importações depreciadas...');
  let hasErrors = false;
  
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        // Ignorar stubs históricos de re-exportação
        if (fullPath.includes('src/domain/validation/schemas.ts') || fullPath.includes('src/types/schemas.ts')) {
          continue;
        }
        
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('domain/validation/schemas') || content.includes('types/schemas')) {
          console.error(`❌ \x1b[31m[Safety-Check-Error]\x1b[0m O arquivo "${path.relative(process.cwd(), fullPath)}" contém referências a schemas legados. Favor importar de "src/models/index.js".`);
          hasErrors = true;
        }
      }
    }
  }
  
  walk(path.join(process.cwd(), 'src'));
  
  if (hasErrors) {
    console.error('🛑 \x1b[31m[Safety-Check]\x1b[0m Falha na checagem de conformidade de imports. Build cancelado.');
    process.exit(1);
  }
  console.log('🟢 \x1b[32m[Safety-Check]\x1b[0m Nenhum import depreciado encontrado nos módulos ativos.');
}

function runCommand(command, args, prefix, colorCode = '\x1b[36m') {
  return new Promise((resolve, reject) => {
    const childEnv = { ...process.env, FORCE_COLOR: '1' };
    
    // Evita o warning de segurança DEP0190 usando shell: false e adaptando para Windows apenas se necessário
    const isWin = process.platform === 'win32';
    const actualCommand = isWin && command === 'npm' ? 'npm.cmd' : command;
    
    const p = spawn(actualCommand, args, { env: childEnv, shell: false });

    const resetColor = '\x1b[0m';
    
    let stdoutBuffer = '';
    p.stdout.on('data', (data) => {
      stdoutBuffer += data.toString();
      const lines = stdoutBuffer.split('\n');
      stdoutBuffer = lines.pop() || '';
      for (const line of lines) {
        if (line.trim()) {
          console.log(`${colorCode}${prefix}${resetColor} ${line}`);
        }
      }
    });

    let stderrBuffer = '';
    p.stderr.on('data', (data) => {
      stderrBuffer += data.toString();
      const lines = stderrBuffer.split('\n');
      stderrBuffer = lines.pop() || '';
      for (const line of lines) {
        if (line.trim()) {
          // esbuild e ferramentas similares direcionam estatísticas de sucesso e logs comuns a stderr.
          // Só rotularemos como de fato erro se houver palavras-chave óbvias de problemas na linha.
          const isRealError = /error|failed|exception/i.test(line);
          const label = isRealError ? ' (Erro)' : '';
          const color = isRealError ? '\x1b[31m' : '\x1b[90m'; // Vermelho se for erro, cinza discreto para logs normais
          console.log(`${color}${prefix}${label}${resetColor} ${line}`);
        }
      }
    });

     p.on('close', (code) => {
      // Flush residual buffers
      if (stdoutBuffer.trim()) {
        console.log(`${colorCode}${prefix}${resetColor} ${stdoutBuffer}`);
      }
      if (stderrBuffer.trim()) {
        const isRealError = /error|failed|exception/i.test(stderrBuffer);
        const label = isRealError ? ' (Erro)' : '';
        const color = isRealError ? '\x1b[31m' : '\x1b[90m';
        console.log(`${color}${prefix}${label}${resetColor} ${stderrBuffer}`);
      }

      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${prefix} falhou com código de status ${code}`));
      }
    });

    p.on('error', (err) => {
      reject(err);
    });
  });
}

async function start() {
  // Executar checagem de conformidade de imports antes de disparar buils paralelos
  verifyNoDeprecatedImports();

  const startTime = Date.now();
  const tasks = [];

  // 1. Build do cliente Vite (dist/)
  tasks.push(
    runCommand('npm', ['run', 'build:client'], '[Client]', '\x1b[34m')
      .then(() => console.log('🟢 \x1b[34m[Client]\x1b[0m Compilado com sucesso.'))
  );

  // 2. Build do servidor esbuild (dist-server/)
  tasks.push(
    runCommand('npm', ['run', 'build:server'], '[Server]', '\x1b[35m')
      .then(() => console.log('🟣 \x1b[35m[Server]\x1b[0m Compilado com sucesso.'))
  );

  // 3. Testes da aplicação (Vitest) - apenas se não skipar
  if (!skipTests) {
    tasks.push(
      runCommand('npm', ['run', 'test'], '[Test]', '\x1b[32m')
        .then(() => console.log('🟢 \x1b[32m[Test]\x1b[0m Testes unitários finalizados com sucesso.'))
    );
  }

  try {
    await Promise.all(tasks);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 \x1b[32mBuild finalizado com sucesso em ${duration}s!\x1b[0m`);
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ \x1b[31mBuild falhou:\x1b[0m`, error.message);
    process.exit(1);
  }
}

start();
