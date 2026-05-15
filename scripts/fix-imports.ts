import fs from 'fs';
import path from 'path';

function walkDir(dir: string, callback: (filepath: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir(path.join(process.cwd(), 'src'), (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    if (content.includes('domain/validation/schemas')) {
      content = content.replace(/['"](\.\.\/)*domain\/validation\/schemas(\.js)?['"]/g, "'../models/index.js'");
      changed = true;
    }
    if (content.includes('types/schemas')) {
      content = content.replace(/['"](\.\.\/)*types\/schemas(\.js)?['"]/g, "'../models/index.js'");
      changed = true;
    }
    
    // Quick fix for potentially broken paths
    content = content.replace(/'\.\.\/models\/index\.js'/g, "import {  } from '../models/index.js';".replace(/import \{  \} from /, ''));
    
    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log('Updated: ' + filePath);
    }
  }
});
