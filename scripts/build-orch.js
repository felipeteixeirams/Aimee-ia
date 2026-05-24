import { spawn } from 'child_process';

const skipTests = process.env.SKIP_TESTS === 'true' || process.env.SKIP_BUILD_TESTS === 'true';

console.log('🚀 \x1b[36mIniciando Orquestrador de Build Otimizado (Aimee AI)...\x1b[0m');
console.log(`- Modo: Execução em Paralelo`);
console.log(`- Pular Testes: ${skipTests ? '✅ Ativado' : '❌ Desativado (Testes rodarão em paralelo)'}`);

function runCommand(command, args, prefix, colorCode = '\x1b[36m') {
  return new Promise((resolve, reject) => {
    const childEnv = { ...process.env, FORCE_COLOR: '1' };
    const p = spawn(command, args, { env: childEnv, shell: true });

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
          console.log(`\x1b[31m${prefix} (Erro)${resetColor} ${line}`);
        }
      }
    });

    p.on('close', (code) => {
      // Flush residual buffers
      if (stdoutBuffer.trim()) console.log(`${colorCode}${prefix}${resetColor} ${stdoutBuffer}`);
      if (stderrBuffer.trim()) console.log(`\x1b[31m${prefix} (Erro)${resetColor} ${stderrBuffer}`);

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
