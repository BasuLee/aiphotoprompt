import fs from 'fs';
import path from 'path';
import { PromptData } from '@/types';
import { extractCategories } from './categories';
import { ensureSlug } from './slug';

/**
 * Load prompt data for a specific locale
 * @param locale - Language locale ('en' for English, 'zh' for Chinese)
 * @returns Promise<PromptData[]> - Array of processed prompt data
 */
export async function loadPromptDataByLocale(locale: string): Promise<PromptData[]> {
  const dataDir = path.join(process.cwd(), 'data');
  
  // Define locale-specific file mappings
  const localeFiles: Record<string, string[]> = {
    'en': ['gpt-4o.en.json', 'nano-banana.en.json'],
    'zh': ['gpt-4o.zh.json', 'nano-banana.zh.json']
  };
  
  // Get files for the specified locale, fallback to all JSON files if locale not found
  const targetFiles = localeFiles[locale] || fs.readdirSync(dataDir).filter(name => name.endsWith('.json'));
  
  const allData: PromptData[] = [];
  
  for (const filename of targetFiles) {
    const filePath = path.join(dataDir, filename);
    
    // Check if file exists before reading
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      
      if (Array.isArray(data)) {
        const processedData = data.map((item: any) => ensureSlug({
          ...item,
          categories: extractCategories(item.prompt || '', item.title || ''),
        }));
        allData.push(...processedData);
      } else if (data && typeof data === 'object') {
        const processedItem = ensureSlug({
          ...data,
          categories: extractCategories(data.prompt || '', data.title || ''),
        });
        allData.push(processedItem);
      }
    } catch (error) {
      console.error(`Error reading file ${filename}:`, error);
    }
  }
  
  return allData.sort((a, b) => a.caseNumber - b.caseNumber);
}

/**
 * Load all prompt data from all JSON files (legacy function for backward compatibility)
 * @returns Promise<PromptData[]> - Array of all processed prompt data
 */
export async function loadPromptData(): Promise<PromptData[]> {
  const dataDir = path.join(process.cwd(), 'data');
  const filenames = fs.readdirSync(dataDir).filter(name => name.endsWith('.json'));
  
  const allData: PromptData[] = [];
  
  for (const filename of filenames) {
    const filePath = path.join(dataDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    if (Array.isArray(data)) {
      const processedData = data.map((item: any) => ensureSlug({
        ...item,
        categories: extractCategories(item.prompt || '', item.title || ''),
      }));
      allData.push(...processedData);
    } else if (data && typeof data === 'object') {
      const processedItem = ensureSlug({
        ...data,
        categories: extractCategories(data.prompt || '', data.title || ''),
      });
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

/**
 * Find a prompt by slug or id
 * @param identifier Either a slug or id to search for
 * @returns The matching prompt or null
 */
export async function findPromptBySlugOrId(identifier: string): Promise<PromptData | null> {
  const prompts = await loadPromptData();
  
  // First try to find by slug
  let prompt = prompts.find(p => p.slug === identifier);
  
  // If not found by slug, try by id
  if (!prompt) {
    prompt = prompts.find(p => p.id === identifier);
  }
  
  return prompt || null;
}