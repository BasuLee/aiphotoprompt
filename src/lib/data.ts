import fs from 'fs';
import path from 'path';
import { PromptData } from '@/types';
import { extractCategories } from './categories';

export async function loadPromptData(): Promise<PromptData[]> {
  const dataDir = path.join(process.cwd(), 'data');
  const filenames = fs.readdirSync(dataDir).filter(name => name.endsWith('.json'));
  
  const allData: PromptData[] = [];
  
  for (const filename of filenames) {
    const filePath = path.join(dataDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    if (Array.isArray(data)) {
      const processedData = data.map((item: any) => ({
        ...item,
        categories: extractCategories(item.prompt || '', item.title || ''),
      }));
      allData.push(...processedData);
    } else if (data && typeof data === 'object') {
      const processedItem = {
        ...data,
        categories: extractCategories(data.prompt || '', data.title || ''),
      };
      allData.push(processedItem);
    }
  }
  
  return allData.sort((a, b) => a.caseNumber - b.caseNumber);
}

export function getAllCategories(prompts: PromptData[]): string[] {
  const categories = new Set<string>();
  prompts.forEach(prompt => {
    if (prompt.categories) {
      prompt.categories.forEach(cat => categories.add(cat));
    }
  });
  return Array.from(categories).sort();
}