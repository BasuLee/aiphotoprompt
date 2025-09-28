import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

export default function Privacy() {
  const router = useRouter();
  const isEn = router.locale === 'en';
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('privacy.title')} - {t('meta.title')}</title>
        <meta 
          name="description" 
          content={t('privacy.description')}
        />
      </Head>

      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('privacy.title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('privacy.lastUpdated')} {new Date().toLocaleDateString(isEn ? 'en-US' : 'zh-CN')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="prose prose-gray max-w-none">
              {isEn ? (
                <>
                  <h2>1. Information We Collect</h2>
                  <p>
                    AI Photo Prompts is committed to protecting your privacy. We collect minimal information necessary to provide our services:
                  </p>
                  <ul>
                    <li><strong>Usage Analytics:</strong> We may collect anonymous usage statistics to improve our service</li>
                    <li><strong>Technical Information:</strong> Basic technical information like browser type and IP address for security purposes</li>
                    <li><strong>Cookies:</strong> We use essential cookies for language preferences and basic functionality</li>
                  </ul>

                  <h2>2. How We Use Your Information</h2>
                  <p>
                    The information we collect is used solely to:
                  </p>
                  <ul>
                    <li>Provide and maintain our service</li>
                    <li>Improve user experience and website performance</li>
                    <li>Ensure security and prevent abuse</li>
                    <li>Remember your language preferences</li>
                  </ul>

                  <h2>3. Information Sharing</h2>
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties. We may share anonymous, aggregated statistics about our users for analytical purposes.
                  </p>

                  <h2>4. Data Security</h2>
                  <p>
                    We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.
                  </p>

                  <h2>5. Cookies and Tracking</h2>
                  <p>
                    Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect some functionality.
                  </p>

                  <h2>6. Third-Party Services</h2>
                  <p>
                    We may use third-party services for analytics and website functionality. These services have their own privacy policies governing the collection and use of information.
                  </p>

                  <h2>7. Your Rights</h2>
                  <p>
                    You have the right to:
                  </p>
                  <ul>
                    <li>Access information we have about you</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Opt-out of certain data collection</li>
                  </ul>

                  <h2>8. Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us through our contact page.
                  </p>
                </>
              ) : (
                <>
                  <h2>1. 我们收集的信息</h2>
                  <p>
                    AI 照片提示致力于保护您的隐私。我们只收集提供服务所必需的最少信息：
                  </p>
                  <ul>
                    <li><strong>使用分析：</strong> 我们可能收集匿名使用统计数据以改进我们的服务</li>
                    <li><strong>技术信息：</strong> 出于安全目的收集的基本技术信息，如浏览器类型和IP地址</li>
                    <li><strong>Cookie：</strong> 我们使用必要的cookies来保存语言偏好和基本功能</li>
                  </ul>

                  <h2>2. 我们如何使用您的信息</h2>
                  <p>
                    我们收集的信息仅用于：
                  </p>
                  <ul>
                    <li>提供和维护我们的服务</li>
                    <li>改善用户体验和网站性能</li>
                    <li>确保安全并防止滥用</li>
                    <li>记住您的语言偏好</li>
                  </ul>

                  <h2>3. 信息共享</h2>
                  <p>
                    我们不会向第三方出售、交易或以其他方式转让您的个人信息。我们可能会出于分析目的共享关于用户的匿名、汇总统计数据。
                  </p>

                  <h2>4. 数据安全</h2>
                  <p>
                    我们实施适当的安全措施来保护您的信息免受未经授权的访问、更改、披露或破坏。
                  </p>

                  <h2>5. Cookie和跟踪</h2>
                  <p>
                    我们的网站使用cookies来增强您的浏览体验。您可以选择通过浏览器设置禁用cookies，但这可能会影响某些功能。
                  </p>

                  <h2>6. 第三方服务</h2>
                  <p>
                    我们可能使用第三方服务进行分析和网站功能。这些服务有自己的隐私政策来管理信息的收集和使用。
                  </p>

                  <h2>7. 您的权利</h2>
                  <p>
                    您有权：
                  </p>
                  <ul>
                    <li>访问我们拥有的关于您的信息</li>
                    <li>请求更正不准确的信息</li>
                    <li>请求删除您的信息</li>
                    <li>选择退出某些数据收集</li>
                  </ul>

                  <h2>8. 联系我们</h2>
                  <p>
                    如果您对本隐私政策有任何疑问，请通过我们的联系页面与我们联系。
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};