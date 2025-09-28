import { useState, useEffect, useMemo } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { PromptData } from '@/types';
import { loadPromptDataByLocale, getAllCategories } from '@/lib/data';
import { initializeSearch, searchPrompts, filterPrompts } from '@/lib/search';
import { SearchFilters } from '@/components/SearchFilters';
import { PromptCard } from '@/components/PromptCard';
import { SEO, createWebsiteJsonLd } from '@/components/SEO';

interface HomeProps {
  prompts: PromptData[];
  categories: string[];
}

export default function Home({ prompts, categories }: HomeProps) {
  const router = useRouter();
  const isEn = router.locale === 'en';
  const { t } = useTranslation('common');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'id' | 'title' | 'model'>('id');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prompts && prompts.length > 0) {
      setIsLoading(true);
      setError(null);
      try {
        initializeSearch(prompts);
      } catch (err) {
        setError(t('errors.searchInitFailed'));
      } finally {
        setIsLoading(false);
      }
    }
  }, [prompts, isEn]);

  const filteredPrompts = useMemo(() => {
    let results = searchTerm ? searchPrompts(searchTerm) : prompts;
    return filterPrompts(results, {
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      sortBy,
    });
  }, [prompts, searchTerm, selectedCategories, sortBy]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <>
      <SEO
        title={t('home.seoTitle')}
        description={t('home.seoDescription', { count: filteredPrompts.length })}
        jsonLd={createWebsiteJsonLd(router.locale || 'en')}
      />

      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100">        
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('home.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.subtitle')}
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Main Content Layout */}
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Sidebar Filters - Hidden on mobile, shown in sidebar on xl+ */}
            <div className="hidden xl:block xl:w-80 xl:flex-shrink-0">
              <div className="sticky top-8">
                <SearchFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryToggle={handleCategoryToggle}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </div>
            </div>

            {/* Mobile Filters - Shown on mobile/tablet, hidden on xl+ */}
            <div className="xl:hidden mb-6">
              <SearchFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
            
            {/* Content Area */}
            <div className="flex-1 min-w-0">
              {/* Results Count */}
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600 text-lg">
                  {t('home.promptsFound', { count: filteredPrompts.length })}
                </p>
              </div>
              
              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-500">
                    {t('home.loading')}
                  </p>
                </div>
              )}
              
              {/* Grid Layout - Responsive columns */}
              {!isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                  {filteredPrompts.map((prompt) => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                  ))}
                </div>
              )}
              
              {/* Empty State */}
              {!isLoading && filteredPrompts.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {t('home.noPromptsFound')}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {t('home.noPromptsDesc')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  try {
    const prompts = await loadPromptDataByLocale(locale || 'en');
    const categories = getAllCategories(prompts);
    
    return {
      props: {
        prompts,
        categories,
        ...(await serverSideTranslations(locale || 'en', ['common'])),
      },
    };
  } catch (error) {
    console.error('Error loading prompt data:', error);
    return {
      props: {
        prompts: [],
        categories: [],
        ...(await serverSideTranslations(locale || 'en', ['common'])),
      },
    };
  }
};