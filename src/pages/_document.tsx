import { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5PC2GXPBVY"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5PC2GXPBVY');
            `,
          }}
        />
        
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6250614423109003"
                crossOrigin="anonymous"></script>
        
        {/* 基本字符集和viewport设置 */}
        <meta charSet="utf-8" />
        
        {/* DNS预获取和预连接 */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Favicon和图标（这些将被SEO组件覆盖，但作为fallback） */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* 主题颜色 - 更新为新的强调色 */}
        <meta name="theme-color" content="#00B7EB" />
        <meta name="msapplication-TileColor" content="#00B7EB" />
        
        {/* 安全相关 */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* 性能优化 */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        
        {/* 验证标签（将来添加） */}
        {/* <meta name="google-site-verification" content="your-verification-code" /> */}
        {/* <meta name="baidu-site-verification" content="your-verification-code" /> */}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// 添加自定义Document.getInitialProps以支持服务端渲染优化
Document.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => App,
      enhanceComponent: (Component) => Component,
    });

  const initialProps = await originalRenderPage();

  return {
    ...initialProps,
  };
};