import { mkdir, readFile, writeFile, readdir, copyFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
const origin = new URL(config.url).origin;
const pages = ['index.html'];
for (const section of ['solutions', 'solution', 'nettoyage', 'composition', 'blog']) {
  const entries = await readdir(path.join(root, section), { withFileTypes: true });
  if (entries.some(entry => entry.name === 'index.html')) pages.push(`${section}/index.html`);
  for (const entry of entries.filter(entry => entry.isDirectory() && entry.name !== 'propositions')) {
    const file = `${section}/${entry.name}/index.html`;
    if (await stat(path.join(root, file)).then(s => s.isFile()).catch(() => false)) pages.push(file);
  }
}
pages.sort();
const pageSet = new Set(pages);
const route = file => '/' + file.replace(/index\.html$/, '');
const assets = new Set(['assets/vendor/THREE-LICENSE.txt', 'assets/vendor/LUCIDE-LICENSE.txt', 'assets/logo/Logo-cubemaster-512px.png']);
const indexed = [];
const titles = new Set();
const descriptions = new Set();
const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of pages) {
  let html = await readFile(path.join(root, file), 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/s)?.[1];
  if (!title || !description || titles.has(title) || descriptions.has(description)) throw new Error(`Missing or duplicate SEO metadata: ${file}`);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) throw new Error(`Expected one H1: ${file}`);
  if (!html.includes(`<link rel="canonical" href="${origin}${route(file)}">`)) throw new Error(`Canonical does not match site.config.json: ${file}`);
  titles.add(title);
  descriptions.add(description);
  if (!/<meta name="robots" content="[^"]*noindex/.test(html)) indexed.push(route(file));

  // Deploy only resources used by public pages; keep source documents and image originals in Git.
  for (const match of html.matchAll(/(?:href|src|srcset|poster)="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) {
      const value = candidate.trim().split(/\s+/)[0];
      if (/^(?:[a-z]+:|\/\/|#)/i.test(value)) continue;
      const url = new URL(value, `https://local.invalid/${file}`);
      const resource = decodeURIComponent(url.pathname).slice(1);
      if (!resource || resource.endsWith('.html') || resource.endsWith('/')) continue;
      assets.add(resource);
    }
  }
  // The source remains usable as local HTML; production links use the canonical directory URLs.
  html = html.replace(/href="([^"]+)"/g, (match, href) => {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(href)) return match;
    const url = new URL(href, `https://local.invalid/${file}`);
    const target = decodeURIComponent(url.pathname).slice(1);
    return pageSet.has(target) ? `href="${route(target)}${url.search}${url.hash}"` : match;
  });
  await mkdir(path.dirname(path.join(dist, file)), { recursive: true });
  await writeFile(path.join(dist, file), html);
}
for (const file of assets) {
  const source = path.resolve(root, file);
  if (!source.startsWith(root) || !(await stat(source)).isFile()) throw new Error(`Missing or invalid resource: ${file}`);
  await mkdir(path.dirname(path.join(dist, file)), { recursive: true });
  await copyFile(source, path.join(dist, file));
}
await copyFile(path.join(root, '404.html'), path.join(dist, '404.html'));
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexed.map(url => `  <url><loc>${escapeXml(origin + url)}</loc></url>`).join('\n')}\n</urlset>\n`);
const redirects = [
  '/hp / 301',
  ...['solution', 'nettoyage', 'composition'].flatMap(section => [
    `/${section}/pyramix/index.html /${section}/pyraminx/ 301!`,
    `/${section}/pyramix /${section}/pyraminx/ 301`,
    `/${section}/pyramix/* /${section}/pyraminx/:splat 301`
  ]),
  ...pages.filter(file => /[345]x[345]/.test(file)).map(file => `${route(file).replaceAll(/([345])x([345])/g, '$1X$2')} ${route(file)} 301`),
  ...pages.map(file => `/${file} ${route(file)} 301!`)
];
await writeFile(path.join(dist, '_redirects'), redirects.join('\n') + '\n');
await writeFile(path.join(dist, '_headers'), '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n/404.html\n  X-Robots-Tag: noindex\n');
console.log(`Built ${pages.length} public pages, ${indexed.length} sitemap URLs and ${assets.size} resources into dist/.`);
