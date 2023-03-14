import fs from 'fs';
import {
  stateSchemeFetch,
  updatedFetchQuery,
  generateSlug,
} from 'utils/fetch';

const baseUrl = 'https://district.openbudgetsindia.org';
const Sitemap = () => {};

function deSlug(str) {
  const re = /(\b[a-z](?!\s))/g;
  const capital = str.replace(re, function (x) {
    return x.toUpperCase();
  });

  return capital.replace('-', ' ');
}
export const getServerSideProps = async function ({ res }) {
  // get JSON URL
  const jsonUrl = await updatedFetchQuery('schemeType', 'all districts')
    .then((res) => res[0].resources.filter((e) => e.format == 'JSON')[0].url)
    .catch((e) => console.error(e));

  // fetch JSON data
  const jsonData = await fetch(jsonUrl)
    .then((res) => res.json())
    .catch((e) => console.error(e));

  const stateData = await stateSchemeFetch();
  const staticPages = fs
    .readdirSync('pages')
    .filter((staticPage) => {
      return ![
        '_app.tsx',
        '_document.tsx',
        '_error.tsx',
        'sitemap.xml.js',
        'index.tsx',
        '[state]',
        'explorer',
      ].includes(staticPage);
    })
    .map((staticPagePath) => {
      return `${baseUrl}/${staticPagePath}`; // Add Static pages like resources, about
    });
  staticPages.unshift(baseUrl); // Remove duplicate of base url

  Object.keys(jsonData).forEach((state) => {
    const slugged = generateSlug(state);
    staticPages.push(`${baseUrl}/${slugged}`);

    Object.values(jsonData[state]).forEach((dist) => {
      staticPages.push(
        `${baseUrl}/${slugged}/${dist.district_code_lg}` // Add District page for each state
      );

      stateData[deSlug(state)].forEach((scheme) =>
        staticPages.push(
          `${baseUrl}/${slugged}/${dist.district_code_lg}/scheme=${scheme.scheme_slug}` // Add Scheme page for each District
        )
      );
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map((url) => {
          return `
            <url>
              <loc>${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>1.0</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
