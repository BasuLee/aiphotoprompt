import { useRouter } from 'next/router';
import Link from 'next/link';

export function Footer() {
  const router = useRouter();
  const isEn = router.locale === 'en';

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    legal: [
      { href: '/terms', label: isEn ? 'Terms of Service' : '服务条款' },
      { href: '/privacy', label: isEn ? 'Privacy Policy' : '隐私政策' },
      { href: '/contact', label: isEn ? 'Contact Us' : '联系我们' },
    ],
    resources: [
      { href: '/', label: isEn ? 'Home' : '首页' },
      { href: '/blog', label: isEn ? 'Blog' : '博客' },
      { href: '/faq', label: isEn ? 'FAQ' : '常见问题' },
    ],
    social: [
      { href: 'https://twitter.com', label: 'Twitter', icon: '𝕏' },
      { href: 'https://github.com', label: 'GitHub', icon: '🐙' },
      { href: 'mailto:firenull52@gmail.com', label: 'Email', icon: '📧' },
    ],
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                {isEn ? 'AI Photo Prompts' : 'AI 照片提示'}
              </h2>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              {isEn
                ? 'Discover professional photography prompts for AI image generation. Create stunning visuals with our curated collection of prompts.'
                : '发现专业的 AI 图像生成摄影提示词。使用我们精选的提示词集合创造令人惊叹的视觉效果。'}
            </p>
            <div className="mt-6">
              <p className="text-xs text-gray-500">
                © {currentYear} {isEn ? 'AI Photo Prompts' : 'AI 照片提示'}. {isEn ? 'All rights reserved.' : '保留所有权利。'}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {isEn ? 'Quick Links' : '快速链接'}
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {isEn ? 'Legal & Support' : '法律与支持'}
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-500">
                {isEn ? 'Follow us:' : '关注我们:'}
              </span>
              {footerLinks.social.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                  title={social.label}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>

            {/* Language & Build Info */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>
                {isEn ? 'Language:' : '语言:'} {isEn ? 'English' : '中文'}
              </span>
              <span>•</span>
              <span>
                {isEn ? 'Made with' : '使用'} ❤️ {isEn ? 'and Next.js' : '和 Next.js 制作'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}