import React from 'react';
import { useTranslation } from 'next-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}: PaginationProps) {
  const { t } = useTranslation('common');

  // 如果只有一页或没有数据，不显示分页
  if (totalPages <= 1 || totalItems === 0) {
    return null;
  }

  // 计算当前页显示的数据范围
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // 生成页码数组（带省略号逻辑）
  const getPageNumbers = (): (number | string)[] => {
    const delta = 2; // 当前页前后显示的页数
    const range: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // 总页数少时显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // 总页数多时使用省略号
      if (currentPage <= 4) {
        // 当前页在前面
        for (let i = 1; i <= 5; i++) {
          range.push(i);
        }
        range.push('...');
        range.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // 当前页在后面
        range.push(1);
        range.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          range.push(i);
        }
      } else {
        // 当前页在中间
        range.push(1);
        range.push('...');
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
          range.push(i);
        }
        range.push('...');
        range.push(totalPages);
      }
    }
    
    return range;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center space-y-4 py-8">
      {/* 结果统计 */}
      <div className="text-sm text-muted-foreground">
        {t('pagination.showing')} {startItem}-{endItem} {t('pagination.of')} {totalItems} {t('pagination.results')}
      </div>

      {/* 分页导航 */}
      <div className="flex items-center space-x-1">
        {/* 上一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
            ${currentPage === 1
              ? 'bg-secondary text-muted-foreground cursor-not-allowed'
              : 'bg-card text-foreground hover:bg-secondary border border-border hover:border-[hsl(var(--ai-accent))] hover:text-[hsl(var(--ai-accent))]'
            }
            transition-colors duration-200
          `}
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="ml-1 hidden sm:inline">{t('common.previous')}</span>
        </button>

        {/* 页码按钮 */}
        <div className="hidden sm:flex items-center space-x-1">
          {pageNumbers.map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === '...' ? (
                <span className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(pageNum as number)}
                  className={`
                    relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
                    ${pageNum === currentPage
                      ? 'bg-[hsl(var(--ai-accent))] text-white border border-[hsl(var(--ai-accent))]'
                      : 'bg-card text-foreground hover:bg-secondary border border-border hover:border-[hsl(var(--ai-accent))] hover:text-[hsl(var(--ai-accent))]'
                    }
                    transition-colors duration-200
                  `}
                  aria-current={pageNum === currentPage ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 移动端页码显示 */}
        <div className="sm:hidden flex items-center px-3 py-2 text-sm font-medium text-muted-foreground">
          {t('pagination.page')} {currentPage} {t('pagination.of')} {totalPages}
        </div>

        {/* 下一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
            ${currentPage === totalPages
              ? 'bg-secondary text-muted-foreground cursor-not-allowed'
              : 'bg-card text-foreground hover:bg-secondary border border-border hover:border-[hsl(var(--ai-accent))] hover:text-[hsl(var(--ai-accent))]'
            }
            transition-colors duration-200
          `}
          aria-label="Next page"
        >
          <span className="mr-1 hidden sm:inline">{t('common.next')}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 快速跳转（桌面端） */}
      {totalPages > 10 && (
        <div className="hidden lg:flex items-center space-x-2 text-sm">
          <span className="text-muted-foreground">Jump to:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            className="w-16 px-2 py-1 text-center border border-border rounded bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ai-accent))] focus:border-transparent"
            placeholder={currentPage.toString()}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt((e.target as HTMLInputElement).value);
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
}