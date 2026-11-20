import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Emits sitemap.xml and robots.txt using the canonical site URL from the environment. */
function seoFiles(siteUrl) {
  return {
    name: 'docvise-seo-files',
    generateBundle() {
      const url = siteUrl.replace(/\/$/, '');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${url}/</loc><changefreq>monthly</changefreq></url></urlset>\n`,
      });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\nSitemap: ${url}/sitemap.xml\n` });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = env.VITE_SITE_URL || 'http://localhost:5173';
  return {
    plugins: [react(), tailwindcss(), seoFiles(siteUrl)],
    server: {
      port: 5173,
      proxy: { '/api': env.VITE_DEV_API_PROXY || 'http://localhost:5050' },
    },
    build: { target: 'es2019', cssCodeSplit: true, sourcemap: false },
  };
});
