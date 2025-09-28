export interface ImageData {
  src: string;
  alt: string;
}

export interface PromptData {
  id: string;
  caseNumber: number;
  model: string;
  slug: string;
  title: string;
  prompt: string;
  inputRequirement?: string;
  referenceNote?: string;
  notes?: string[];
  author?: string;
  authorUrl?: string;
  sourceLinks?: string[];
  inputImages?: ImageData[];
  outputImages?: ImageData[];
  originalPrompt?: string;
  englishPrompt?: string;
  description?: string;
  guidance?: string;
  isSelected?: boolean;
  categories?: string[];
}

export interface SearchFilters {
  searchTerm: string;
  selectedCategories: string[];
  sortBy: 'id' | 'title' | 'model';
}

// SEO相关类型定义
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
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface WebsiteJsonLd {
  '@context': string;
  '@type': 'WebSite';
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  publisher: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  potentialAction: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

export interface ArticleJsonLd {
  '@context': string;
  '@type': 'Article';
  headline: string;
  description: string;
  url: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    url: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  image?: {
    '@type': 'ImageObject';
    url: string;
    caption: string;
  };
  articleSection: string;
  keywords: string;
  inLanguage: string;
  about: {
    '@type': 'Thing';
    name: string;
  };
}

export interface BreadcrumbJsonLd {
  '@context': string;
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}