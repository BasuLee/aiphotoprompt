import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const router = useRouter();
  const isEn = router.locale === 'en';
  const { t } = useTranslation('common');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = isEn ? [
    {
      question: "What are AI photo prompts?",
      answer: "AI photo prompts are detailed text descriptions that guide AI image generation models to create specific types of photographs. They include elements like style, composition, lighting, and subject matter to achieve desired results."
    },
    {
      question: "How do I use these prompts effectively?",
      answer: "Copy the prompts and use them in AI image generation tools like Midjourney, DALL-E, Stable Diffusion, or similar platforms. You can also modify them by adding your own creative elements or adjusting parameters to suit your vision."
    },
    {
      question: "Can I modify the prompts?",
      answer: "Absolutely! Our prompts are designed to be starting points. Feel free to adapt them by changing subjects, styles, lighting conditions, or adding your own creative elements to make them unique."
    },
    {
      question: "What AI tools work with these prompts?",
      answer: "These prompts are compatible with most text-to-image AI models including Midjourney, DALL-E, Stable Diffusion, Adobe Firefly, and many others. The exact syntax might need minor adjustments depending on the platform."
    },
    {
      question: "Are the prompts free to use?",
      answer: "Yes, all prompts in our gallery are free to use for personal and commercial projects. We believe in making AI creativity accessible to everyone."
    },
    {
      question: "How often do you add new prompts?",
      answer: "We regularly update our collection with new prompts based on trending styles, user requests, and emerging AI capabilities. Check back frequently for fresh inspiration."
    }
  ] : [
    {
      question: "什么是 AI 照片提示词？",
      answer: "AI 照片提示词是详细的文本描述，用于指导 AI 图像生成模型创建特定类型的照片。它们包括风格、构图、光线和主题等元素，以实现期望的结果。"
    },
    {
      question: "如何有效使用这些提示词？",
      answer: "复制提示词并在 AI 图像生成工具中使用，如 Midjourney、DALL-E、Stable Diffusion 或类似平台。您也可以通过添加自己的创意元素或调整参数来修改它们，以适应您的视觉需求。"
    },
    {
      question: "我可以修改这些提示词吗？",
      answer: "当然可以！我们的提示词被设计为起点。请随意通过更改主题、风格、光照条件或添加您自己的创意元素来调整它们，使其独一无二。"
    },
    {
      question: "这些提示词适用于哪些 AI 工具？",
      answer: "这些提示词与大多数文本到图像 AI 模型兼容，包括 Midjourney、DALL-E、Stable Diffusion、Adobe Firefly 和许多其他工具。根据平台不同，确切的语法可能需要轻微调整。"
    },
    {
      question: "这些提示词可以免费使用吗？",
      answer: "是的，我们图库中的所有提示词都可以免费用于个人和商业项目。我们相信让每个人都能享受 AI 创造的乐趣。"
    },
    {
      question: "你们多久添加新的提示词？",
      answer: "我们根据流行风格、用户请求和新兴 AI 能力定期更新我们的收集。请经常回来查看新的灵感。"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>{t('faq.title')} - {t('meta.title')}</title>
        <meta 
          name="description" 
          content={t('faq.description')}
        />
      </Head>

      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('faq.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('faq.subtitle')}
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 text-center bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('faq.stillHaveQuestions')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('faq.cantFindAnswer')}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {t('faq.contactUs')}
            </a>
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