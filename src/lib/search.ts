import FlexSearch from 'flexsearch';
import { PromptData } from '@/types';

let searchIndex: FlexSearch.Index | null = null;
let searchData: PromptData[] = [];

export function initializeSearch(data: PromptData[]) {
  searchIndex = new FlexSearch.Index({
    tokenize: 'forward',
    cache: true,
  });
  
  searchData = data;
  
  data.forEach((item, index) => {
    const searchText = `${item.title} ${item.prompt} ${item.description} ${item.model} ${(item.categories || []).join(' ')}`;
    searchIndex!.add(index, searchText);
  });
}

export function searchPrompts(query: string): PromptData[] {
  if (!searchIndex || !query.trim()) {
    return searchData;
  }
  
  const results = searchIndex.search(query, { limit: 100 });
  return results.map(index => searchData[index as number]);
}

export function filterPrompts(
  prompts: PromptData[],
  filters: {
    categories?: string[];
    sortBy?: 'id' | 'title' | 'model';
  }
): PromptData[] {
  let filtered = [...prompts];
  
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(prompt => 
      filters.categories!.some(cat => 
        prompt.categories?.includes(cat)
      )
    );
  }
  
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'model':
          return a.model.localeCompare(b.model);
        case 'id':
        default:
          return b.caseNumber - a.caseNumber; // 倒序排列，最新的在前面
      }
    });
  }
  
  return filtered;
}