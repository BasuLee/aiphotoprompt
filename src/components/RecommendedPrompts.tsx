import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PromptData } from '@/types';
import { CopyButton } from './CopyButton';
import { useTranslation } from 'next-i18next';

interface RecommendedPromptsProps {
  currentPrompt: PromptData;
  recommendations: PromptData[];
}

export function RecommendedPrompts({ currentPrompt, recommendations }: RecommendedPromptsProps) {
  const router = useRouter();
  const isEn = router.locale === 'en';
  const { t } = useTranslation('common');
  
  // 翻译分类名称
  const translateCategory = (category: string) => {
    return t(`categories.${category}`, category);
  };

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isEn ? 'Recommended Prompts' : '推荐提示词'}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {isEn 
              ? 'Discover more creative AI photo prompts that complement your current selection. These carefully curated prompts share similar themes, styles, or techniques that can help expand your creative possibilities and enhance your AI image generation workflow.'
              : '发现更多与您当前选择相关的创意AI照片提示词。这些精心策划的提示词具有相似的主题、风格或技术，可以帮助拓展您的创意可能性，增强您的AI图像生成工作流程。'
            }
          </p>
          {currentPrompt.categories && currentPrompt.categories.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">
                {isEn ? 'Related categories:' : '相关分类：'}
              </p>
              <div className="flex flex-wrap gap-2">
                {currentPrompt.categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                  >
                    {translateCategory(category)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((prompt) => (
            <RecommendedPromptCard key={prompt.id} prompt={prompt} isEn={isEn} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEn ? 'Explore More Prompts' : '探索更多提示词'}
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="mt-8 prose prose-gray max-w-none">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {isEn ? 'Why These Prompts?' : '为什么推荐这些提示词？'}
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                {isEn ? 'Category Matching' : '分类匹配'}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {isEn 
                  ? 'These prompts share similar categories and themes with your current selection, ensuring thematic consistency and complementary creative directions for your AI image generation projects.'
                  : '这些提示词与您当前的选择具有相似的分类和主题，确保主题一致性和互补的创意方向，适合您的AI图像生成项目。'
                }
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                {isEn ? 'Technical Compatibility' : '技术兼容性'}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {isEn 
                  ? 'All recommended prompts are tested and optimized for similar AI models and techniques, providing reliable results and consistent quality across your creative workflow.'
                  : '所有推荐的提示词都经过测试和优化，适用于相似的AI模型和技术，为您的创意工作流程提供可靠的结果和一致的质量。'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">
            {isEn ? 'Pro Tips for Using These Prompts' : '使用这些提示词的专业技巧'}
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              {isEn 
                ? 'Combine elements from multiple prompts to create unique variations'
                : '结合多个提示词的元素创建独特的变化'
              }
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              {isEn 
                ? 'Adjust style parameters based on your specific project requirements'
                : '根据您的具体项目要求调整风格参数'
              }
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              {isEn 
                ? 'Use these as starting points and add your own creative modifications'
                : '将这些作为起点，添加您自己的创意修改'
              }
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

interface RecommendedPromptCardProps {
  prompt: PromptData;
  isEn: boolean;
}

function RecommendedPromptCard({ prompt, isEn }: RecommendedPromptCardProps) {
  const { t } = useTranslation('common');
  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors group">
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {prompt.title}
          </h3>
          <CopyButton text={prompt.prompt} size="sm" />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <span>#{prompt.caseNumber}</span>
          <span>•</span>
          <span>{prompt.model}</span>
        </div>

        {prompt.categories && prompt.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {prompt.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="px-2 py-1 text-xs bg-white text-gray-600 rounded-full border"
              >
                {t(`categories.${category}`, category)}
              </span>
            ))}
            {prompt.categories.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-400">
                +{prompt.categories.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 leading-relaxed mb-2">
          {truncateText(prompt.description || prompt.prompt, 120)}
        </p>
        
        {prompt.guidance && (
          <p className="text-xs text-gray-500 italic">
            {isEn ? 'Guidance: ' : '指导: '}{truncateText(prompt.guidance, 80)}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <Link
          href={`/prompt/${prompt.slug || prompt.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium group-hover:underline"
          onClick={(e) => {
            console.log('Recommended prompt link clicked:', prompt.slug || prompt.id, prompt.title);
          }}
        >
          {isEn ? 'View Details' : '查看详情'}
        </Link>
        
        <div className="flex items-center text-xs text-gray-400">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {isEn ? 'View' : '查看'}
        </div>
      </div>
    </div>
  );
}