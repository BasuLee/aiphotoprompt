import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Layout } from '@/components/Layout';
import '@/styles/globals.css';
import nextI18NextConfig from '../../next-i18next.config.js';

function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default appWithTranslation(App, nextI18NextConfig as any);
