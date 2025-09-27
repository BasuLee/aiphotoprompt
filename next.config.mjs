/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    localeDetection: false,
  },
};

export default nextConfig;