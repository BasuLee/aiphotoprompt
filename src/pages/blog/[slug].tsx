import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getBlogPost, getBlogPosts, createBlogPostJsonLd, createBreadcrumbJsonLd, BlogPost } from '../../lib/blog';
import { SEO } from '../../components/SEO';

interface BlogPostPageProps {
  post: BlogPost | null;
  relatedPosts: BlogPost[];
}

export default function BlogPostPage({ post, relatedPosts }: BlogPostPageProps) {
  const router = useRouter();
  const isEn = router.locale === 'en';
  const { t } = useTranslation('common');

  if (!post) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('blog.postNotFound')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('blog.postNotFoundDesc')}
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isEn) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const breadcrumbItems = [
    { name: t('blog.home'), url: `https://ai-photo-prompt.com/${router.locale}/` },
    { name: t('blog.title'), url: `https://ai-photo-prompt.com/${router.locale}/blog/` },
    { name: isEn ? post.title.en : post.title.zh, url: `https://ai-photo-prompt.com/${router.locale}/blog/${post.slug}/` },
  ];

  return (
    <>
      <SEO
        title={isEn ? post.title.en : post.title.zh}
        description={isEn ? post.description.en : post.description.zh}
        ogType="article"
        article={{
          author: post.author.name,
          publishedTime: post.publishedAt,
          modifiedTime: post.publishedAt,
          section: t('blog.aiTechnology'),
          tags: post.tags,
        }}
        jsonLd={createBlogPostJsonLd(post, router.locale || 'en')}
      />

      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Link 
                href="/"
                className="hover:text-gray-700 transition-colors duration-200"
              >
                {t('blog.home')}
              </Link>
              <span>/</span>
              <Link 
                href="/blog"
                className="hover:text-gray-700 transition-colors duration-200"
              >
                {t('blog.title')}
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium truncate">
                {isEn ? post.title.en : post.title.zh}
              </span>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Article Header */}
          <header className="mb-12">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {isEn ? post.title.en : post.title.zh}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold text-sm">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.author.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(post.publishedAt)}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isEn ? post.readingTime.en : post.readingTime.zh}
              </div>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {isEn ? post.description.en : post.description.zh}
            </p>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg md:prose-xl max-w-none">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: (isEn ? post.content.en : post.content.zh)
                  .split('\n')
                  .map(line => {
                    // Convert markdown-style headers to HTML
                    if (line.startsWith('# ')) {
                      return `<h1 class="text-3xl font-bold text-gray-900 mt-12 mb-6 first:mt-0">${line.slice(2)}</h1>`;
                    }
                    if (line.startsWith('## ')) {
                      return `<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-5">${line.slice(3)}</h2>`;
                    }
                    if (line.startsWith('### ')) {
                      return `<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">${line.slice(4)}</h3>`;
                    }
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return `<p class="font-bold text-gray-900 mt-6 mb-3">${line.slice(2, -2)}</p>`;
                    }
                    if (line.trim() === '') {
                      return '<div class="h-4"></div>';
                    }
                    if (line.startsWith('- ')) {
                      return `<li class="text-gray-700 leading-relaxed ml-6">${line.slice(2)}</li>`;
                    }
                    if (line.match(/^\d+\. /)) {
                      return `<li class="text-gray-700 leading-relaxed ml-6">${line.replace(/^\d+\. /, '')}</li>`;
                    }
                    if (line.startsWith('```')) {
                      return line === '```' ? '' : `<pre class="bg-gray-100 p-4 rounded-lg my-6 overflow-x-auto"><code>${line.slice(3)}</code></pre>`;
                    }
                    // Regular paragraph
                    return `<p class="text-gray-700 leading-relaxed mb-6">${line}</p>`;
                  })
                  .join('')
              }}
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200">
            {/* Share Section */}
            <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium">
                  {t('blog.shareArticle')}
                </span>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(isEn ? post.title.en : post.title.zh)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                      }
                    }}
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                      }
                    }}
                    className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Back to Blog */}
            <div className="text-center">
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('blog.backToBlog')}
              </Link>
            </div>
          </footer>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="bg-white border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
                {t('blog.relatedArticles')}
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      {relatedPost.tags.slice(0, 1).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      <Link 
                        href={`/blog/${relatedPost.slug}`}
                        className="hover:text-blue-600 transition-colors duration-200"
                      >
                        {isEn ? relatedPost.title.en : relatedPost.title.zh}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {isEn ? relatedPost.description.en : relatedPost.description.zh}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span>{formatDate(relatedPost.publishedAt)}</span>
                      <span className="mx-2">•</span>
                      <span>{isEn ? relatedPost.readingTime.en : relatedPost.readingTime.zh}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* JSON-LD for breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createBreadcrumbJsonLd(breadcrumbItems, router.locale || 'en')),
        }}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const slug = params?.slug as string;
  const post = getBlogPost(slug);
  
  if (!post) {
    return {
      notFound: true,
    };
  }

  // Get related posts (exclude current post, limit to 3)
  const allPosts = getBlogPosts();
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 3);

  return {
    props: {
      post,
      relatedPosts,
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};