import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation('common');
  
  // 翻译分类名称
  const translateCategory = (category: string) => {
    return t(`categories.${category}`, category); // 如果翻译不存在，返回原始值
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          {t('search.label')}
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          {t('filters.sortBy')}
        </label>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'id' | 'title' | 'model')}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer pr-10"
          >
            <option value="id">{t('filters.sortOptions.id')}</option>
            <option value="title">{t('filters.sortOptions.title')}</option>
            <option value="model">{t('filters.sortOptions.model')}</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {categories.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            {t('filters.categories')}
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryToggle(category)}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
                  selectedCategories.includes(category)
                    ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {translateCategory(category)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}