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
import { Pagination } from '@/components/Pagination';
import { SEO, createWebsiteJsonLd } from '@/components/SEO';

interface HomeProps {
  prompts: PromptData[];
  categories: string[];
}

const ITEMS_PER_PAGE = 20;

export default function Home({ prompts, categories }: HomeProps) {
  const router = useRouter();
  const isEn = router.locale === 'en';
  const { t } = useTranslation('common');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'id' | 'title' | 'model'>('id');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 从URL获取当前页码
  const currentPage = parseInt(router.query.page as string) || 1;

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

  // 过滤和排序后的提示词
  const filteredPrompts = useMemo(() => {
    let results = searchTerm ? searchPrompts(searchTerm) : prompts;
    return filterPrompts(results, {
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      sortBy,
    });
  }, [prompts, searchTerm, selectedCategories, sortBy]);

  // 分页计算
  const totalPages = Math.ceil(filteredPrompts.length / ITEMS_PER_PAGE);
  const paginatedPrompts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPrompts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPrompts, currentPage]);

  // 处理页码变更
  const handlePageChange = (page: number) => {
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 更新URL
    const query = { ...router.query };
    if (page === 1) {
      delete query.page; // 第一页时不显示page参数
    } else {
      query.page = page.toString();
    }
    
    router.push({
      pathname: router.pathname,
      query,
    }, undefined, { shallow: true });
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    // 筛选变化时重置到第一页
    if (currentPage !== 1) {
      handlePageChange(1);
    }
  };

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    // 搜索变化时重置到第一页
    if (currentPage !== 1) {
      handlePageChange(1);
    }
  };

  const handleSortChange = (newSortBy: 'id' | 'title' | 'model') => {
    setSortBy(newSortBy);
    // 排序变化时重置到第一页
    if (currentPage !== 1) {
      handlePageChange(1);
    }
  };

  return (
      <>
      <SEO
        title={t('home.seoTitle')}
        description={t('home.seoDescription', { count: filteredPrompts.length })}
        jsonLd={createWebsiteJsonLd(router.locale || 'en')}
      />

      <div className="bg-gradient-to-br from-background via-card to-secondary">        
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Hero Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[hsl(var(--header-color))] mb-4">
              {t('home.title')}
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              {t('home.subtitle')}
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Search and Filter Section - Centered */}
          <div className="mb-6 max-w-4xl mx-auto">
            <SearchFilters
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Content Area */}
          <div className="max-w-[2000px] mx-auto">
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
                {paginatedPrompts.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            )}
            
            {/* Empty State */}
            {!isLoading && filteredPrompts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-[hsl(var(--header-color))] mb-2">
                  {t('home.noPromptsFound')}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {t('home.noPromptsDesc')}
                </p>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && filteredPrompts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredPrompts.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            )}
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