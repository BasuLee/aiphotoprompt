import { useRouter } from 'next/router';
import Link from 'next/link';

export function Header() {
  const router = useRouter();
  const isEn = router.locale === 'en';

  const toggleLanguage = () => {
    const newLocale = isEn ? 'zh' : 'en';
    router.push(router.asPath, router.asPath, { locale: newLocale });
  };

  return (
    <header className=\"bg-white shadow-sm border-b border-gray-200\">
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
        <div className=\"flex justify-between items-center h-16\">
          <Link href=\"/\" className=\"text-xl font-bold text-gray-900\">
            {isEn ? 'AI Photo Prompts' : 'AI 照片提示'}
          </Link>
          
          <button
            onClick={toggleLanguage}
            className=\"px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors\"
          >
            {isEn ? '中文' : 'English'}
          </button>
        </div>
      </div>
    </header>
  );
}