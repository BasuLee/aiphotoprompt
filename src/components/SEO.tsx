import Head from 'next/head';
import { useRouter } from 'next/router';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
  article?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
  jsonLd?: Record<string, any>;
}

export function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  noIndex = false,
  article,
  jsonLd,
}: SEOProps) {
  const router = useRouter();
  const { locale, asPath } = router;
  const isEn = locale === 'en';
  
  // 默认配置
  const defaultTitle = isEn ? 'AI Photo Prompts' : 'AI 照片提示';
  const defaultDescription = isEn 
    ? '#1 Professional photography prompts for AI image generation. Discover high-quality prompts for creating stunning AI-generated photos with detailed instructions and examples.'
    : '#1 专业的 AI 图像生成摄影提示词。发现高质量的提示词，用于创建令人惊叹的 AI 生成照片，包含详细说明和示例。';
  
  // 构建最终标题
  const finalTitle = title 
    ? `${title} - ${defaultTitle}`
    : defaultTitle;
  
  // 构建最终描述
  const finalDescription = description || defaultDescription;
  
  // 构建canonical URL
  const baseUrl = 'https://ai-photo-prompt.com';
  const cleanPath = asPath.split('?')[0].split('#')[0];
  const finalCanonical = canonical || `${baseUrl}/${locale}${cleanPath === '/' ? '' : cleanPath}/`;
  
  // 构建hreflang URLs
  const hreflangs = [
    { lang: 'en', url: `${baseUrl}/en${cleanPath === '/' ? '' : cleanPath}/` },
    { lang: 'zh', url: `${baseUrl}/zh${cleanPath === '/' ? '' : cleanPath}/` },
    { lang: 'x-default', url: `${baseUrl}/en${cleanPath === '/' ? '' : cleanPath}/` },
  ];
  
  // 默认OG图片
  const defaultOgImage = `${baseUrl}/og-image.jpg`;
  const finalOgImage = ogImage || defaultOgImage;

  return (
    <Head>
      {/* 基本meta标签 */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonical} />
      
      {/* Hreflang标签 */}
      {hreflangs.map((hreflang) => (
        <link
          key={hreflang.lang}
          rel="alternate"
          hrefLang={hreflang.lang}
          href={hreflang.url}
        />
      ))}
      
      {/* Robots meta */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph标签 */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={isEn ? 'en_US' : 'zh_CN'} />
      <meta property="og:site_name" content={defaultTitle} />
      
      {/* Article特定的OG标签 */}
      {article && ogType === 'article' && (
        <>
          {article.author && <meta property="article:author" content={article.author} />}
          {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags && article.tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      
      {/* Favicon和图标 */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#3b82f6" />
      
      {/* 移动端优化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* JSON-LD结构化数据 */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}
    </Head>
  );
}

// 预定义的JSON-LD模板
export const createWebsiteJsonLd = (locale: string) => {
  const isEn = locale === 'en';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: isEn ? 'AI Photo Prompts' : 'AI 照片提示',
    description: isEn 
      ? 'Professional photography prompts for AI image generation'
      : '专业的 AI 图像生成摄影提示词',
    url: `https://ai-photo-prompt.com/${locale}/`,
    inLanguage: isEn ? 'en-US' : 'zh-CN',
    publisher: {
      '@type': 'Organization',
      name: isEn ? 'AI Photo Prompts' : 'AI 照片提示',
      url: 'https://ai-photo-prompt.com/',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://ai-photo-prompt.com/${locale}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

export const createArticleJsonLd = (
  prompt: {
    id: string;
    title: string;
    description?: string;
    prompt: string;
    author?: string;
    caseNumber: number;
    categories?: string[];
    outputImages?: Array<{ src: string; alt: string }>;
  },
  locale: string
) => {
  const isEn = locale === 'en';
  const baseUrl = 'https://ai-photo-prompt.com';
  const url = `${baseUrl}/${locale}/prompt/${prompt.id}/`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: prompt.title,
    description: prompt.description || prompt.prompt.substring(0, 160),
    url,
    author: {
      '@type': 'Person',
      name: prompt.author || (isEn ? 'AI Photo Prompts Team' : 'AI 照片提示团队'),
    },
    publisher: {
      '@type': 'Organization',
      name: isEn ? 'AI Photo Prompts' : 'AI 照片提示',
      url: 'https://ai-photo-prompt.com/',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(prompt.outputImages && prompt.outputImages.length > 0 && {
      image: {
        '@type': 'ImageObject',
        url: prompt.outputImages[0].src,
        caption: prompt.outputImages[0].alt,
      },
    }),
    articleSection: isEn ? 'AI Photography Prompts' : 'AI 摄影提示词',
    keywords: prompt.categories?.join(', ') || (isEn ? 'AI, photography, prompts' : 'AI, 摄影, 提示词'),
    inLanguage: isEn ? 'en-US' : 'zh-CN',
    about: {
      '@type': 'Thing',
      name: isEn ? 'AI Image Generation' : 'AI 图像生成',
    },
  };
};

export const createBreadcrumbJsonLd = (
  items: Array<{ name: string; url: string }>,
  locale: string
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};