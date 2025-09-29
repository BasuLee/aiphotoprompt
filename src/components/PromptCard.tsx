import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { PromptData } from '@/types';
import { CopyButton } from './CopyButton';
import { ImageDisplay } from './ImageDisplay';

interface PromptCardProps {
  prompt: PromptData;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const router = useRouter();
  const isEn = router.locale === 'en';
  const { t } = useTranslation('common');
  const detailHref = `/prompt/${prompt.slug || prompt.id}/`;

  // 翻译分类名称
  const translateCategory = (category: string) => {
    return t(`categories.${category}`, category); // 如果翻译不存在，返回原始值
  };

  // 生成图片的 alt 属性，包含关键词
  const generateImageAlt = () => {
    const keywords = [prompt.title, prompt.model, ...(prompt.categories || [])].join(', ');
    return `AI generated image for: ${keywords}`;
  };

  return (
    <div className="group bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-xl hover:border-[hsl(var(--ai-accent))] transition-all duration-300 transform hover:-translate-y-1">
      {/* 图片显示区域 */}
      {prompt.outputImages && prompt.outputImages.length > 0 && (
        <Link href={detailHref} className="relative block h-56 w-full overflow-hidden bg-secondary">
          <ImageDisplay
            images={[{
              ...prompt.outputImages[0],
              alt: generateImageAlt()
            }]}
            variant="card"
            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
            showFirst={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[hsl(var(--header-color))] mb-2 group-hover:text-[hsl(var(--ai-accent))] transition-colors line-clamp-2">
              {prompt.title}
            </h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="bg-secondary px-2 py-1 rounded-md font-medium">#{prompt.caseNumber}</span>
              <span>•</span>
              <span className="bg-[hsl(var(--ai-accent))]/10 text-[hsl(var(--ai-accent))] px-2 py-1 rounded-md font-medium">{prompt.model}</span>
            </div>
          </div>
        </div>

        {prompt.categories && prompt.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {prompt.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full border border-border hover:bg-[hsl(var(--ai-accent))]/10 hover:text-[hsl(var(--ai-accent))] transition-colors"
              >
                {translateCategory(category)}
              </span>
            ))}
            {prompt.categories.length > 3 && (
              <span className="px-3 py-1 text-xs text-muted-foreground rounded-full">
                +{prompt.categories.length - 3}
              </span>
            )}
          </div>
        )}

        <p className="text-foreground/80 text-sm mb-6 line-clamp-3 leading-relaxed">
          {prompt.description || prompt.prompt}
        </p>

        <div className="flex justify-between items-center pt-4 border-t border-border">
          <Link
            href={detailHref}
            className="inline-flex items-center text-[hsl(var(--ai-accent))] hover:text-[hsl(var(--ai-accent))]/80 text-sm font-semibold group-hover:text-[hsl(var(--ai-accent))]/90 transition-colors"
            onClick={(e) => {
              console.log('Link clicked:', prompt.slug || prompt.id, prompt.title);
            }}
          >
            <span>{t('prompt.viewDetails')}</span>
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <CopyButton text={prompt.prompt} />
        </div>
      </div>
    </div>
  );
}
