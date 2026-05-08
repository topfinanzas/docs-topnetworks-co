import fs from 'node:fs';
import path from 'node:path';

const PAGES_DIR = path.resolve('src/pages');
const PUBLIC_DIR = path.resolve('public');

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : 'Untitled';
}

function extractDescription(content) {
  // Find the first paragraph after the title
  // A paragraph is text that doesn't start with # and isn't empty
  const lines = content.split('\n');
  let titleFound = false;
  
  for (const line of lines) {
    if (line.startsWith('#')) {
      titleFound = true;
      continue;
    }
    
    if (titleFound && line.trim() !== '' && !line.startsWith('!') && !line.startsWith('<')) {
      return line.trim();
    }
  }
  return '';
}

function getFiles(dir, lang = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(getFiles(filePath, file));
    } else if (filePath.endsWith('.md')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const route = file.replace('.md', '');
      const pathUrl = `/${lang}${route === 'index' ? '' : '/' + route}`;
      
      results.push({
        lang: lang || 'es', // default if not in a folder
        route: pathUrl,
        file: file,
        fullPath: filePath,
        content: content,
        title: extractTitle(content),
        description: extractDescription(content)
      });
    }
  }
  return results;
}

function generateAgentContext() {
  console.log('Generating Agent Context...');
  
  // Create public directory if it doesn't exist
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const allPages = getFiles(PAGES_DIR);
  
  // --- Task 1: Agentic Indexing ---
  const indexData = allPages.map(page => ({
    title: page.title,
    description: page.description,
    route: page.route,
    lang: page.lang
  }));
  
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'agent-index.json'), 
    JSON.stringify(indexData, null, 2)
  );
  console.log('✅ Created public/agent-index.json');

  // --- Task 2: RAG-Ready Content ---
  let llmsFullContent = '# TopNetworks Inc. Complete Documentation Context\n\n';
  llmsFullContent += 'This file contains the complete, aggregated documentation for all TopNetworks properties, designed for LLM context retrieval.\n\n';
  
  // Group by language
  const pagesByLang = allPages.reduce((acc, page) => {
    if (!acc[page.lang]) acc[page.lang] = [];
    acc[page.lang].push(page);
    return acc;
  }, {});

  for (const [lang, pages] of Object.entries(pagesByLang)) {
    llmsFullContent += `\n=================================================================\n`;
    llmsFullContent += `LANGUAGE: ${lang.toUpperCase()}\n`;
    llmsFullContent += `=================================================================\n\n`;
    
    for (const page of pages) {
      llmsFullContent += `\n--- ROUTE: ${page.route} ---\n\n`;
      llmsFullContent += page.content;
      llmsFullContent += `\n\n`;
    }
  }
  
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), llmsFullContent);
  console.log('✅ Created public/llms-full.txt');

  // --- Task 3: llms.txt Implementation ---
  let llmsTxt = `# TopNetworks Engineering Documentation

> Single source of truth for the technology stack, architecture, shared components, and operational workflows of TopNetworks Inc.

## Complete Context
For the complete, aggregated documentation suitable for full context injection, please read:
[Full Documentation Context](https://docs.topnetworks.co/llms-full.txt)

## Available Sections

`;

  // Add English sections
  llmsTxt += `### English (/en)\n`;
  const enPages = pagesByLang['en'] || [];
  for (const page of enPages) {
    llmsTxt += `- [${page.title}](https://docs.topnetworks.co${page.route}): ${page.description}\n`;
  }

  // Add Spanish sections
  llmsTxt += `\n### Español (/es)\n`;
  const esPages = pagesByLang['es'] || [];
  for (const page of esPages) {
    llmsTxt += `- [${page.title}](https://docs.topnetworks.co${page.route}): ${page.description}\n`;
  }

  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llmsTxt);
  console.log('✅ Created public/llms.txt');
}

generateAgentContext();
