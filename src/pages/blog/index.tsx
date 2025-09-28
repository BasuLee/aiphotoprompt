import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getBlogPosts, createBlogJsonLd, BlogPost } from '../../lib/blog';
import { SEO } from '../../components/SEO';

interface BlogIndexProps {
  posts: BlogPost[];
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  const router = useRouter();
  const isEn = router.locale === 'en';
  const { t } = useTranslation('common');

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

  return (
    <>
      <SEO
        title={t('blog.title')}
        description={t('blog.description')}
        jsonLd={createBlogJsonLd(router.locale || 'en')}
      />

      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {t('blog.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('blog.subtitle')}
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid gap-8 md:gap-12 lg:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
              >
                <div className="p-6 md:p-8">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="hover:underline"
                    >
                      {isEn ? post.title.en : post.title.zh}
                    </Link>
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {isEn ? post.description.en : post.description.zh}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {isEn ? post.readingTime.en : post.readingTime.zh}
                      </span>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center mt-6 pt-6 border-t border-gray-100">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {post.author.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {post.author.name}
                      </p>
                    </div>
                  </div>

                  {/* Read More Link */}
                  <div className="mt-6">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:underline transition-colors duration-200"
                    >
                      {t('blog.readFullArticle')}
                      <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t('blog.stayUpdated')}
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              {t('blog.stayUpdatedDesc')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              {t('blog.contactUs')}
            </Link>
          </div>

          {/* Navigation */}
          <div className="mt-12 text-center">
            <nav className="inline-flex items-center space-x-2 text-sm text-gray-500">
              <Link 
                href="/"
                className="hover:text-gray-700 transition-colors duration-200"
              >
                {t('blog.home')}
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                {t('blog.title')}
              </span>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const posts = getBlogPosts();

  return {
    props: {
      posts,
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};