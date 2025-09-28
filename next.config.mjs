/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    localeDetection: false,
  },
};

export default nextConfig;