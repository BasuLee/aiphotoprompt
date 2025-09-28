import { NextApiRequest, NextApiResponse } from 'next';
import { loadPromptDataByLocale } from '@/lib/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const baseUrl = 'https://ai-photo-prompt.com';
    const currentDate = new Date().toISOString();
    
    // 获取所有语言的数据
    const [enPrompts, zhPrompts] = await Promise.all([
      loadPromptDataByLocale('en'),
      loadPromptDataByLocale('zh'),
    ]);

    // 构建sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Homepage URLs -->
  <url>
    <loc>${baseUrl}/en/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/" />
  </url>
  <url>
    <loc>${baseUrl}/zh/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/" />
  </url>
  
  <!-- English Prompt URLs -->
  ${enPrompts.map(prompt => `<url>
    <loc>${baseUrl}/en/prompt/${prompt.id}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/prompt/${prompt.id}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/prompt/${prompt.id}/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/prompt/${prompt.id}/" />
  </url>`).join('\n  ')}
  
  <!-- Chinese Prompt URLs -->
  ${zhPrompts.map(prompt => `<url>
    <loc>${baseUrl}/zh/prompt/${prompt.id}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/prompt/${prompt.id}/" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/zh/prompt/${prompt.id}/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/en/prompt/${prompt.id}/" />
  </url>`).join('\n  ')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ message: 'Error generating sitemap' });
  }
}