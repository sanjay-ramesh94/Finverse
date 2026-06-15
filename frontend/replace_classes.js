import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  { regex: /\btext-white\b/g, replace: 'text-slate-900' },
  { regex: /\btext-slate-100\b/g, replace: 'text-slate-900' },
  { regex: /\btext-slate-200\b/g, replace: 'text-slate-700' },
  { regex: /\btext-slate-300\b/g, replace: 'text-slate-600' },
  { regex: /\btext-slate-400\b/g, replace: 'text-slate-500' },
  { regex: /\bbg-zinc-900\b/g, replace: 'bg-white' },
  { regex: /\bbg-zinc-800\b/g, replace: 'bg-white shadow-sm border border-slate-200' },
  { regex: /\bbg-zinc-700\b/g, replace: 'bg-slate-50 border border-slate-200' },
  { regex: /\bborder-zinc-600\b/g, replace: 'border-slate-200' },
  { regex: /\bborder-zinc-700\b/g, replace: 'border-slate-200' },
  { regex: /\bborder-zinc-800\b/g, replace: 'border-slate-200' },
  { regex: /\btext-indigo-400\b/g, replace: 'text-slate-800' },
  { regex: /\btext-indigo-300\b/g, replace: 'text-slate-700' },
  { regex: /\bbg-indigo-600\b/g, replace: 'bg-slate-900 text-white' },
  { regex: /\bhover:bg-indigo-700\b/g, replace: 'hover:bg-slate-800' },
  { regex: /\bshadow-indigo-600\/30\b/g, replace: 'shadow-slate-900/10' },
  { regex: /\bbg-black\b/g, replace: 'bg-slate-50' },
  { regex: /\bbg-black\/60\b/g, replace: 'bg-white/90 border border-slate-200' },
  { regex: /\bhover:bg-white\/5\b/g, replace: 'hover:bg-black/5' },
  { regex: /\bfrom-black\b/g, replace: 'from-slate-50' },
  { regex: /\bto-zinc-800\b/g, replace: 'to-white' },
  { regex: /\bvia-zinc-900\b/g, replace: 'via-slate-50' },
  { regex: /\bto-gray-900\b/g, replace: 'to-white' }
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      replacements.forEach(({ regex, replace }) => {
        content = content.replace(regex, replace);
      });

      // Special handling for the double replacements, since bg-slate-900 might replace back to something if we were not careful, but our order is safe.
      // E.g. bg-zinc-800 to bg-white shadow-sm border border-slate-200. We don't want "text-slate-900 text-white" if the component originally had text-white and bg-indigo-600
      content = content.replace(/text-slate-900 text-white/g, 'text-white');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log('Class replacement complete.');
