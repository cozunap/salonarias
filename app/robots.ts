import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/salon'], // Disallow admin area
    },
    sitemap: 'https://salonbeautearias.ca/sitemap.xml',
  };
}
