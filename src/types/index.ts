export interface PromptData {
  id: string;
  caseNumber: number;
  model: string;
  slug: string;
  title: string;
  prompt: string;
  inputRequirement: string;
  originalPrompt: string;
  englishPrompt: string;
  description: string;
  guidance: string;
  isSelected: boolean;
  categories?: string[];
}

export interface SearchFilters {
  searchTerm: string;
  selectedCategories: string[];
  sortBy: 'id' | 'title' | 'model';
}