/**
 * Instant Preset Sample Benchmarks Data
 * Provides realistic pre-built audit datasets for instant 1-click testing & demoing.
 */
const PRESET_AUDITS = {
  unoptimized: {
    url: 'https://local-business-demo.com',
    hostname: 'local-business-demo.com',
    scannedAt: new Date().toISOString(),
    overallScore: 58,
    categories: {
      seo: { score: 45, label: 'SEO' },
      security: { score: 55, label: 'Security' },
      performance: { score: 65, label: 'Performance' },
      health: { score: 65, label: 'Website Health' }
    },
    techStack: [
      { name: 'WordPress 5.8', category: 'CMS', badgeColor: '#21759b' },
      { name: 'jQuery 3.5.1', category: 'JS Library', badgeColor: '#0769ad' },
      { name: 'Bootstrap 4', category: 'CSS Framework', badgeColor: '#7952b3' },
      { name: 'Apache Server', category: 'Infrastructure', badgeColor: '#d22128' }
    ],
    stats: {
      totalIssues: 9,
      criticalCount: 4,
      warningCount: 3,
      passedCount: 2,
      responseTimeMs: 1850
    },
    majorDealbreakers: [
      {
        title: 'Missing Meta Description Tag',
        businessImpact: 'Can significantly reduce click-through rates from search results. Google picks random text instead of your sales pitch.',
        category: 'SEO'
      },
      {
        title: 'No Sitemap.xml File Detected',
        businessImpact: 'Search engines index new pages and services less efficiently, causing new content to take weeks to show on Google.',
        category: 'SEO'
      },
      {
        title: 'Unconfigured Contact Form (Broken Action)',
        businessImpact: 'Submissions fail silently! Prospective customers submitting lead inquiries experience broken forms and abandon your service.',
        category: 'Health'
      }
    ],
    outreachEmailPitch: `Subject: Quick audit of local-business-demo.com - Score 58/100

Hi Team,

I ran an automated quality audit on local-business-demo.com and noticed the website currently scores 58/100.

Here are the top dealbreaker issues directly impacting your traffic and customer conversions:

  1. Missing Meta Description Tag (Can significantly reduce click-through rates from search results)
  2. No Sitemap.xml File Detected (Search engines index pages less efficiently)
  3. Unconfigured Contact Form (Submissions fail silently and leads abandon your service)

Fixing these issues can significantly increase your search engine visibility and customer conversion rates.

Would you be open to a 10-minute call this week to review the full client report? I can send over the step-by-step resolution plan.

Best regards,
[Your Name / Agency]`,
    issues: [
      {
        id: 'seo-no-meta-description',
        category: 'SEO',
        title: 'Missing Meta Description Tag',
        severity: 'critical',
        description: 'No `<meta name="description">` tag detected in page head.',
        businessImpact: 'Can significantly reduce click-through rates from search results. Google will pick random content snippets from your page instead of your sales pitch.',
        recommendation: 'Add a compelling 120-160 character meta description summarizing your site value proposition.',
        codeSnippet: `<meta name="description" content="Discover local premium services with fast delivery, guaranteed satisfaction, and 24/7 customer support.">`
      },
      {
        id: 'seo-no-sitemap',
        category: 'SEO',
        title: 'No Sitemap.xml File Detected',
        severity: 'critical',
        description: 'Unable to locate a public `/sitemap.xml` file.',
        businessImpact: 'Search engines index pages less efficiently, causing newly updated pages or blog posts to take weeks to show up on Google.',
        recommendation: 'Generate an XML sitemap listing your website URLs and submit it to Google Search Console.',
        codeSnippet: `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://local-business-demo.com/</loc>\n    <priority>1.0</priority>\n  </url>\n</urlset>`
      },
      {
        id: 'health-broken-form',
        category: 'Health',
        title: 'Unconfigured Contact Form Detected',
        severity: 'critical',
        description: 'Web form found without an `action` destination or submit handler.',
        businessImpact: 'Submissions fail silently! Leads submitting inquiries will experience broken forms and abandon your service.',
        recommendation: 'Connect form actions to a backend handler or submission API service.',
        codeSnippet: `<form action="/api/contact" method="POST">\n  <input type="email" name="email" required />\n  <button type="submit">Submit Inquiry</button>\n</form>`
      },
      {
        id: 'sec-no-hsts',
        category: 'Security',
        title: 'Missing HSTS Security Header',
        severity: 'critical',
        description: 'No `Strict-Transport-Security` header provided by web server.',
        businessImpact: 'Leaves users vulnerable to SSL stripping attacks where malicious networks downgrade HTTPS connections to insecure HTTP.',
        recommendation: 'Add the HSTS response header with a long `max-age` value.',
        codeSnippet: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
      },
      {
        id: 'seo-suboptimal-title-length',
        category: 'SEO',
        title: 'Suboptimal Title Length (22 characters)',
        severity: 'warning',
        description: 'Current title "Local Business Site" is too short. Recommended length is 30–60 characters.',
        businessImpact: 'Search engine title snippets may look incomplete, lowering click-through rate.',
        recommendation: 'Expand title text to between 30 and 60 characters.',
        codeSnippet: `<title>Local Business Services & Quality Solutions | City Name</title>`
      },
      {
        id: 'sec-no-csp',
        category: 'Security',
        title: 'Missing Content Security Policy (CSP)',
        severity: 'warning',
        description: 'No `Content-Security-Policy` header detected.',
        businessImpact: 'Increases risk of Cross-Site Scripting (XSS) attacks.',
        recommendation: 'Configure a restrictive CSP specifying allowed script sources.',
        codeSnippet: `Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com;`
      },
      {
        id: 'perf-slow-response',
        category: 'Performance',
        title: 'Server Response Latency (1,850 ms)',
        severity: 'warning',
        description: 'Initial server HTTP response took 1,850ms. Recommended threshold is under 800ms.',
        businessImpact: 'Slow loading times increase user dropoff.',
        recommendation: 'Enable server caching and optimize database queries.',
        codeSnippet: `Cache-Control: public, max-age=86400`
      },
      {
        id: 'sec-https-passed',
        category: 'Security',
        title: 'HTTPS Encryption Enforced',
        severity: 'passed',
        description: 'Site communicates over encrypted TLS/SSL connection.',
        businessImpact: 'Protects user data in transit.',
        recommendation: 'Maintain SSL certificate auto-renewal.'
      },
      {
        id: 'health-favicon-passed',
        category: 'Health',
        title: 'Website Favicon Configured',
        severity: 'passed',
        description: 'Favicon link present.',
        businessImpact: 'Enhances browser tab brand recognition.',
        recommendation: 'Maintain favicon icon quality.'
      }
    ]
  },

  ecommerce: {
    url: 'https://fashion-boutique-shop.com',
    hostname: 'fashion-boutique-shop.com',
    scannedAt: new Date().toISOString(),
    overallScore: 84,
    categories: {
      seo: { score: 88, label: 'SEO' },
      security: { score: 85, label: 'Security' },
      performance: { score: 78, label: 'Performance' },
      health: { score: 85, label: 'Website Health' }
    },
    techStack: [
      { name: 'Shopify Plus', category: 'E-Commerce', badgeColor: '#95bf47' },
      { name: 'Stripe Payments', category: 'Payments', badgeColor: '#635bfc' },
      { name: 'Cloudflare CDN', category: 'CDN & Security', badgeColor: '#f38020' },
      { name: 'Google Analytics 4', category: 'Analytics', badgeColor: '#f9ab00' },
      { name: 'Meta Pixel', category: 'Marketing', badgeColor: '#0081fb' }
    ],
    stats: {
      totalIssues: 6,
      criticalCount: 1,
      warningCount: 2,
      passedCount: 3,
      responseTimeMs: 620
    },
    majorDealbreakers: [
      {
        title: 'Unoptimized High-Resolution Product Images',
        businessImpact: 'Large image asset sizes delay mobile page rendering, increasing cart abandonment.',
        category: 'Performance'
      },
      {
        title: 'Missing Image Alt Tags on Category Grid',
        businessImpact: 'Missing image alt text limits search engine indexing for Google Image Search queries.',
        category: 'SEO'
      }
    ],
    outreachEmailPitch: `Subject: Quick audit of fashion-boutique-shop.com - Score 84/100

Hi Fashion Boutique Team,

Great looking store! I conducted an automated performance and SEO check on fashion-boutique-shop.com (Score 84/100).

We identified 2 quick optimization wins that can help boost your checkout conversion rate:
  1. Image Compression Optimization (Compress product image payloads to speed up mobile page load by ~35%)
  2. Image Alt Tag Coverage (Add Alt attributes for Google Image Search discovery)

Would you be open to reviewing the full technical report?

Best regards,
[Your Name / Agency]`,
    issues: [
      {
        id: 'perf-large-images',
        category: 'Performance',
        title: 'Unoptimized Image Asset Payloads',
        severity: 'critical',
        description: 'Multiple product hero images exceed 1.2 MB file size without WebP compression.',
        businessImpact: 'Slow mobile product page loading leads to lost sales and higher cart dropoff.',
        recommendation: 'Convert product photos to WebP format and enable responsive `srcset` scaling.',
        codeSnippet: `<img src="hero.webp" srcset="hero-400.webp 400w, hero-800.webp 800w" alt="Summer collection photo">`
      },
      {
        id: 'seo-missing-image-alt',
        category: 'SEO',
        title: 'Missing Alt Text on 8 Catalog Images',
        severity: 'warning',
        description: 'Catalog images lack alt attributes.',
        businessImpact: 'Limits image search traffic and accessibility compliance.',
        recommendation: 'Add descriptive alt text to all product catalog images.',
        codeSnippet: `<img src="dress.jpg" alt="Floral summer silk dress in green">`
      },
      {
        id: 'sec-hsts-passed',
        category: 'Security',
        title: 'HSTS Security Header Active',
        severity: 'passed',
        description: 'HSTS enabled.',
        businessImpact: 'Prevents connection downgrade attacks.',
        recommendation: 'Maintain settings.'
      },
      {
        id: 'seo-title-passed',
        category: 'SEO',
        title: 'Page Title & Open Graph Metadata Configured',
        severity: 'passed',
        description: 'Title tag and OG tags configured.',
        businessImpact: 'Polished previews when shared on social media.',
        recommendation: 'Keep tags up to date.'
      }
    ]
  },

  agency: {
    url: 'https://growth-agency-partners.com',
    hostname: 'growth-agency-partners.com',
    scannedAt: new Date().toISOString(),
    overallScore: 72,
    categories: {
      seo: { score: 75, label: 'SEO' },
      security: { score: 70, label: 'Security' },
      performance: { score: 70, label: 'Performance' },
      health: { score: 75, label: 'Website Health' }
    },
    techStack: [
      { name: 'WordPress', category: 'CMS', badgeColor: '#21759b' },
      { name: 'Tailwind CSS', category: 'CSS Framework', badgeColor: '#38bdf8' },
      { name: 'Hotjar', category: 'Analytics', badgeColor: '#ff3c00' },
      { name: 'HubSpot', category: 'CRM & Marketing', badgeColor: '#ff7a59' }
    ],
    stats: {
      totalIssues: 7,
      criticalCount: 2,
      warningCount: 3,
      passedCount: 2,
      responseTimeMs: 1100
    },
    majorDealbreakers: [
      {
        title: 'Multiple H1 Headline Tags Detected',
        businessImpact: 'Multiple H1 tags dilute main page keywords and confuse Google search indexing hierarchy.',
        category: 'SEO'
      },
      {
        title: 'Missing Content Security Policy (CSP)',
        businessImpact: 'Increases risk of Cross-Site Scripting (XSS) script injections.',
        category: 'Security'
      }
    ],
    outreachEmailPitch: `Subject: Audit findings for growth-agency-partners.com - Score 72/100

Hi Growth Agency Team,

We audited growth-agency-partners.com and scored it at 72/100.

Key dealbreakers found:
  1. Multiple H1 Headline Tags (Dilutes primary keyword signals in Google)
  2. Missing CSP Headers (Increases vulnerability to script injections)

Attached is the full technical breakdown report.

Best regards,
[Your Name / Agency]`,
    issues: [
      {
        id: 'seo-multiple-h1',
        category: 'SEO',
        title: 'Multiple H1 Headline Tags (3 found)',
        severity: 'critical',
        description: 'Page contains 3 `<h1>` tags.',
        businessImpact: 'Multiple H1 tags dilute keyword signals in search rankings.',
        recommendation: 'Use one single `<h1>` tag per page and secondary `<h2>` tags for section titles.',
        codeSnippet: `<h1>Main Agency Value Headline</h1>\n<h2>Our Core Services</h2>`
      },
      {
        id: 'sec-no-csp',
        category: 'Security',
        title: 'Missing Content Security Policy (CSP)',
        severity: 'critical',
        description: 'No CSP header detected.',
        businessImpact: 'Leaves site vulnerable to unauthorized cross-site script execution.',
        recommendation: 'Add CSP response header.',
        codeSnippet: `Content-Security-Policy: default-src 'self';`
      }
    ]
  },

  tech: {
    url: 'https://cloud-saas-platform.io',
    hostname: 'cloud-saas-platform.io',
    scannedAt: new Date().toISOString(),
    overallScore: 94,
    categories: {
      seo: { score: 95, label: 'SEO' },
      security: { score: 98, label: 'Security' },
      performance: { score: 90, label: 'Performance' },
      health: { score: 92, label: 'Website Health' }
    },
    techStack: [
      { name: 'Next.js 14', category: 'React Framework', badgeColor: '#000000' },
      { name: 'React 18', category: 'UI Framework', badgeColor: '#61dafb' },
      { name: 'Tailwind CSS', category: 'CSS Framework', badgeColor: '#38bdf8' },
      { name: 'Vercel', category: 'Hosting', badgeColor: '#000000' },
      { name: 'Stripe', category: 'Payments', badgeColor: '#635bfc' }
    ],
    stats: {
      totalIssues: 4,
      criticalCount: 0,
      warningCount: 1,
      passedCount: 3,
      responseTimeMs: 340
    },
    majorDealbreakers: [],
    outreachEmailPitch: `Subject: Impressive audit score for cloud-saas-platform.io - Score 94/100

Hi Team,

Compliments on your site performance! cloud-saas-platform.io scored an impressive 94/100 on our automated quality audit.

Everything from your Next.js architecture to HSTS security and TTFB speed (340ms) is top tier.

Keep up the great work!`,
    issues: [
      {
        id: 'perf-fast-response',
        category: 'Performance',
        title: 'Ultra-Fast Response Time (340 ms)',
        severity: 'passed',
        description: 'Vercel edge network response in 340ms.',
        businessImpact: 'Delivers instant initial render.',
        recommendation: 'Maintain edge caching.'
      },
      {
        id: 'sec-https-passed',
        category: 'Security',
        title: 'Full HSTS & CSP Security Active',
        severity: 'passed',
        description: 'All security headers properly set.',
        businessImpact: 'High standard enterprise security.',
        recommendation: 'Maintain current configuration.'
      }
    ]
  }
};
