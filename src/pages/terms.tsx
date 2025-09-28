import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

export default function Terms() {
  const router = useRouter();
  const isEn = router.locale === 'en';
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('terms.title')} - {t('meta.title')}</title>
        <meta 
          name="description" 
          content={t('terms.description')}
        />
      </Head>

      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('terms.title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('terms.lastUpdated')} {new Date().toLocaleDateString(isEn ? 'en-US' : 'zh-CN')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="prose prose-gray max-w-none">
              {isEn ? (
                <>
                  <h2>1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using the AI Photo Prompts platform, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>

                  <h2>2. Use License</h2>
                  <p>
                    Permission is granted to temporarily download one copy of the materials on AI Photo Prompts' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul>
                    <li>modify or copy the materials</li>
                    <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                    <li>attempt to decompile or reverse engineer any software contained on the website</li>
                    <li>remove any copyright or other proprietary notations from the materials</li>
                  </ul>

                  <h2>3. Content Usage</h2>
                  <p>
                    All prompts and content provided on this platform are available for free use in personal and commercial AI image generation projects. Users are free to modify and adapt the prompts to suit their creative needs.
                  </p>

                  <h2>4. Disclaimer</h2>
                  <p>
                    The materials on AI Photo Prompts' website are provided on an 'as is' basis. AI Photo Prompts makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>

                  <h2>5. Limitations</h2>
                  <p>
                    In no event shall AI Photo Prompts or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AI Photo Prompts' website, even if AI Photo Prompts or its authorized representative has been notified orally or in writing of the possibility of such damage.
                  </p>

                  <h2>6. Contact Information</h2>
                  <p>
                    If you have any questions about these Terms of Service, please contact us through our contact page.
                  </p>
                </>
              ) : (
                <>
                  <h2>1. 条款接受</h2>
                  <p>
                    通过访问和使用 AI 照片提示平台，您接受并同意受本协议条款和条文的约束。
                  </p>

                  <h2>2. 使用许可</h2>
                  <p>
                    允许您临时下载 AI 照片提示网站上的材料副本，仅供个人、非商业性的临时查看。这是许可证的授予，不是所有权的转让，在此许可证下，您不得：
                  </p>
                  <ul>
                    <li>修改或复制材料</li>
                    <li>将材料用于任何商业目的或任何公开展示（商业或非商业）</li>
                    <li>尝试反编译或逆向工程网站上包含的任何软件</li>
                    <li>从材料中删除任何版权或其他专有标记</li>
                  </ul>

                  <h2>3. 内容使用</h2>
                  <p>
                    本平台提供的所有提示词和内容均可免费用于个人和商业 AI 图像生成项目。用户可以自由修改和调整提示词以满足其创意需求。
                  </p>

                  <h2>4. 免责声明</h2>
                  <p>
                    AI 照片提示网站上的材料按"现状"提供。AI 照片提示不作任何明示或暗示的保证，特此否认并拒绝所有其他保证，包括但不限于对适销性、特定用途适用性或不侵犯知识产权或其他权利侵犯的暗示保证或条件。
                  </p>

                  <h2>5. 责任限制</h2>
                  <p>
                    在任何情况下，AI 照片提示或其供应商均不对因使用或无法使用 AI 照片提示网站上的材料而产生的任何损害（包括但不限于数据或利润损失或业务中断造成的损害）承担责任，即使 AI 照片提示或其授权代表已口头或书面通知此类损害的可能性。
                  </p>

                  <h2>6. 联系信息</h2>
                  <p>
                    如果您对这些服务条款有任何疑问，请通过我们的联系页面与我们联系。
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