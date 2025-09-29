import { GetStaticProps, GetStaticPaths } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PromptData } from '@/types';
import { loadPromptDataByLocale } from '@/lib/data';
import { getRecommendations } from '@/lib/recommendations';
import { CopyButton } from '@/components/CopyButton';
import { RecommendedPrompts } from '@/components/RecommendedPrompts';
import { SEO, createArticleJsonLd, createBreadcrumbJsonLd } from '@/components/SEO';

interface PromptDetailProps {
  prompt: PromptData | null;
  recommendations: PromptData[];
}

export default function PromptDetail({ prompt, recommendations }: PromptDetailProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  
  // 翻译分类名称
  const translateCategory = (category: string) => {
    return t(`categories.${category}`, category); // 如果翻译不存在，返回原始值
  };

  if (!prompt) {
    return (
      <>
        <SEO
          title={t('details.notFound')}
          description={t('details.notFoundDesc')}
          noIndex={true}
        />
        <div className="min-h-screen bg-gray-100">
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {t('details.notFound')}
              </h1>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                {t('details.backToHome')}
              </Link>
            </div>
          </main>
        </div>
      </>
    );
  }

  // 获取图片数据
  const hasInputImages = prompt.inputImages && prompt.inputImages.length > 0;
  const hasOutputImages = prompt.outputImages && prompt.outputImages.length > 0;
  const mainImage = prompt.outputImages?.[0] || prompt.inputImages?.[0];

  // 构建SEO数据
  const seoTitle = `${prompt.title} - ${t('meta.title')}`;
  const seoDescription = router.locale === 'en'
    ? `#1 ${prompt.description || prompt.prompt.substring(0, 120)}... Professional AI photography prompt for ${prompt.model}. Case #${prompt.caseNumber} with detailed instructions and example images.`
    : `#1 ${prompt.description || prompt.prompt.substring(0, 120)}... 专业的 ${prompt.model} AI 摄影提示词。案例 #${prompt.caseNumber}，包含详细说明和示例图片。`;

  // 构建面包屑数据
  const breadcrumbItems = [
    {
      name: t('nav.home'),
      url: `https://ai-photo-prompt.com/${router.locale}/`,
    },
    {
      name: prompt.title,
      url: `https://ai-photo-prompt.com/${router.locale}/prompt/${prompt.id}/`,
    },
  ];

  // 构建JSON-LD数据
  const articleJsonLd = createArticleJsonLd(prompt, router.locale || 'en');
  const breadcrumbJsonLd = createBreadcrumbJsonLd(breadcrumbItems, router.locale || 'en');
  const combinedJsonLd = [articleJsonLd, breadcrumbJsonLd];

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={`https://ai-photo-prompt.com/${router.locale}/prompt/${prompt.id}/`}
        ogType="article"
        ogImage={mainImage?.src}
        article={{
          author: prompt.author,
          section: t('meta.keywords'),
          tags: prompt.categories,
        }}
        jsonLd={combinedJsonLd}
      />

      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 返回链接 */}
          <div className="mb-6">
            <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {t('details.backToGallery')}
            </Link>
          </div>

          {/* 标题和基本信息 - 所有标签横向排列 */}
          <div className="mb-8">
            <div className="flex items-center flex-wrap gap-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {prompt.title}
              </h1>
              
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-lg border border-gray-300 shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                {prompt.caseNumber}
              </span>
              
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {prompt.model}
              </span>
              
              {prompt.categories && prompt.categories.length > 0 && (
                <>
                  {prompt.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200 rounded-lg hover:from-emerald-100 hover:to-green-100 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {translateCategory(category)}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* 图片展示区域 - 移动到标题下方 */}
          {(hasInputImages || hasOutputImages) && (
            <div className="mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-lg border">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 输入图片区域 - 简洁设计 */}
                  {hasInputImages && (
                    <div className="relative group">
                      <div className="absolute -top-2 left-6 z-20">
                        <div className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-full shadow-lg border border-gray-300">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-sm font-medium">{t('details.inputImages')}</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl p-6 pt-8 border border-gray-200">
                        <div className="space-y-6">
                          {prompt.inputImages?.map((image, index) => (
                            <div key={index} className="relative group/img">
                              <div className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                                <img
                                  src={image.src}
                                  alt={image.alt}
                                  className="w-full h-auto object-contain hover:scale-[1.01] transition-transform duration-300"
                                  style={{ 
                                    maxHeight: 'none',
                                    aspectRatio: 'auto'
                                  }}
                                />
                              </div>
                              {image.alt && (
                                <div className="mt-3 p-3 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <svg className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="leading-relaxed">{image.alt}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 输出图片区域 - 简洁设计 */}
                  {hasOutputImages && (
                    <div className={`relative group ${!hasInputImages ? 'lg:col-span-2' : ''}`}>
                      <div className="absolute -top-2 left-6 z-20">
                        <div className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-full shadow-lg border border-gray-300">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-sm font-medium">{t('details.generatedImages')}</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl p-6 pt-8 border border-gray-200">
                        <div className={`${!hasInputImages ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}`}>
                          {prompt.outputImages?.map((image, index) => (
                            <div key={index} className="relative group/img">
                              <div className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                                <img
                                  src={image.src}
                                  alt={image.alt}
                                  className="w-full h-auto object-contain hover:scale-[1.01] transition-transform duration-300"
                                  style={{ 
                                    maxHeight: 'none',
                                    aspectRatio: 'auto'
                                  }}
                                />
                              </div>
                              {image.alt && (
                                <div className="mt-3 p-3 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <svg className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="leading-relaxed">{image.alt}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Prompt 文本 - 独立一行 */}
          <div className="mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t('details.prompt')}
                </h2>
                <CopyButton text={prompt.prompt} />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <code className="text-base text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                  {prompt.prompt}
                </code>
              </div>
              
              {/* 英文提示词 */}
              {prompt.englishPrompt && prompt.englishPrompt !== prompt.prompt && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t('details.englishPrompt')}
                    </h3>
                    <CopyButton text={prompt.englishPrompt} />
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <code className="text-base text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                      {prompt.englishPrompt}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* 详细信息区域 - 一行显示次要信息 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* 输入要求 / 使用指导 */}
            {(prompt.inputRequirement || prompt.guidance) && (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                {prompt.inputRequirement && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {t('details.requirements')}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {prompt.inputRequirement}
                    </p>
                  </div>
                )}
                
                {prompt.guidance && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      {t('details.guidance')}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {prompt.guidance}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 作者信息 */}
            {prompt.author && (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t('details.author')}
                </h3>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {prompt.author.charAt(prompt.author.startsWith('@') ? 1 : 0).toUpperCase()}
                  </div>
                  <div>
                    {prompt.authorUrl ? (
                      <a 
                        href={prompt.authorUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center text-sm"
                      >
                        {prompt.author}
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <span className="font-medium text-gray-900 text-sm">{prompt.author}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 来源链接 */}
            {prompt.sourceLinks && prompt.sourceLinks.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {t('details.sourceLinks')}
                </h3>
                <div className="space-y-3">
                  {prompt.sourceLinks.map((link, index) => {
                    const url = new URL(link);
                    const hostname = url.hostname;
                    const pathname = url.pathname;
                    
                    // 判断链接类型
                    let linkType = '';
                    let icon = null;
                    
                    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
                      // 进一步判断是用户主页还是具体推文
                      if (pathname.includes('/status/')) {
                        linkType = t('details.tweetPost');
                        icon = (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        );
                      } else {
                        linkType = t('details.authorProfile');
                        icon = (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        );
                      }
                    } else if (hostname.includes('github.com')) {
                      linkType = t('details.sourceCode');
                      icon = (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      );
                    } else if (hostname.includes('instagram.com')) {
                      linkType = t('details.instagram');
                      icon = (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      );
                    } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
                      linkType = t('details.video');
                      icon = (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      );
                    } else if (pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || hostname.includes('imgur.com') || hostname.includes('imagehosting')) {
                      linkType = t('details.imageSource');
                      icon = (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      );
                    } else if (hostname.includes('discord.com') || hostname.includes('discord.gg')) {
                      linkType = t('details.discord');
                      icon = (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.120.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                      );
                    } else if (hostname.includes('reddit.com')) {
                      linkType = t('details.redditPost');
                      icon = (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                        </svg>
                      );
                    } else {
                      // 基于 URL 路径进一步判断
                      if (pathname.includes('/post') || pathname.includes('/article') || pathname.includes('/blog')) {
                        linkType = t('details.articlePost');
                      } else if (pathname.includes('/gallery') || pathname.includes('/image')) {
                        linkType = t('details.gallery');
                      } else {
                        linkType = t('details.website');
                      }
                      icon = (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      );
                    }
                    
                    return (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-blue-600 hover:text-blue-800 p-3 bg-blue-50 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center">
                          <div className="mr-3 text-blue-500">
                            {icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{linkType}</div>
                            <div className="text-xs text-gray-500">{hostname}</div>
                          </div>
                        </div>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 备注 */}
            {prompt.notes && prompt.notes.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {t('details.notes')}
                </h3>
                <ul className="space-y-2">
                  {prompt.notes.map((note, index) => (
                    <li key={index} className="text-sm text-gray-700 leading-relaxed flex items-start">
                      <span className="text-gray-400 mr-2 mt-1">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 推荐内容 */}
          {recommendations.length > 0 && (
            <div className="mt-12">
              <RecommendedPrompts 
                recommendations={recommendations} 
                currentPrompt={prompt}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // 为所有语言生成路径
    const locales = ['en', 'zh'];
    const paths = [];

    for (const locale of locales) {
      const prompts = await loadPromptDataByLocale(locale);
      for (const prompt of prompts) {
        // 同时支持 slug 和 id 两种路径
        paths.push({
          params: { id: prompt.slug || prompt.id },
          locale,
        });
        // 如果 slug 和 id 不同，为 id 也生成路径
        if (prompt.slug && prompt.slug !== prompt.id) {
          paths.push({
            params: { id: prompt.id },
            locale,
          });
        }
      }
    }

    return {
      paths,
      fallback: false, // 404 for non-existent paths
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  try {
    const prompts = await loadPromptDataByLocale(locale || 'en');
    const prompt = prompts.find(p => p.id === params?.id || p.slug === params?.id);
    
    if (!prompt) {
      return {
        notFound: true,
      };
    }

    const recommendations = getRecommendations(prompt, prompts);
    
    return {
      props: {
        prompt,
        recommendations,
        ...(await serverSideTranslations(locale || 'en', ['common'])),
      },
      // 重新生成间隔：每天重新生成一次
      revalidate: 86400, // 24 hours
    };
  } catch (error) {
    console.error('Error loading prompt:', error);
    return {
      notFound: true,
    };
  }
};