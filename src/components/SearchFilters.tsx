import { useRouter } from 'next/router';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categories: string[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  sortBy: 'id' | 'title' | 'model';
  onSortChange: (sortBy: 'id' | 'title' | 'model') => void;
}

export function SearchFilters({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategories,
  onCategoryToggle,
  sortBy,
  onSortChange,
}: SearchFiltersProps) {
  const router = useRouter();
  const isEn = router.locale === 'en';

  return (
    <div className=\"space-y-4 p-4 bg-gray-50 rounded-lg\">
      <div>
        <label className=\"block text-sm font-medium text-gray-700 mb-2\">
          {isEn ? 'Search' : '搜索'}
        </label>
        <input
          type=\"text\"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={isEn ? 'Search prompts...' : '搜索提示词...'}
          className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
        />
      </div>

      <div>
        <label className=\"block text-sm font-medium text-gray-700 mb-2\">
          {isEn ? 'Sort by' : '排序方式'}
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'id' | 'title' | 'model')}
          className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
        >
          <option value=\"id\">{isEn ? 'Case Number' : '案例编号'}</option>
          <option value=\"title\">{isEn ? 'Title' : '标题'}</option>
          <option value=\"model\">{isEn ? 'Model' : '模型'}</option>
        </select>
      </div>

      {categories.length > 0 && (
        <div>
          <label className=\"block text-sm font-medium text-gray-700 mb-2\">
            {isEn ? 'Categories' : '分类'}
          </label>
          <div className=\"flex flex-wrap gap-2\">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryToggle(category)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${\n                  selectedCategories.includes(category)\n                    ? 'bg-blue-100 border-blue-300 text-blue-700'\n                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'\n                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}