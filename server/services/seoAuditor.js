/**
 * SEO Auditor Module
 * Checks title tags, meta descriptions, headings, open graph, canonicals, image alt tags, sitemap & robots.
 */
function auditSEO($, robotsFound, sitemapFound, url) {
  const issues = [];
  let score = 100;

  // 1. Page Title Check
  const titleText = $('title').first().text().trim();
  if (!titleText) {
    score -= 20;
    issues.push({
      id: 'seo-no-title',
      category: 'SEO',
      title: 'Missing Page Title Tag',
      severity: 'critical',
      description: 'The web page has no `<title>` tag in the `<head>` section.',
      businessImpact: 'Severe drop in search engine ranking. Search engines cannot display a proper clickable headline in search results, resulting in massive traffic loss.',
      recommendation: 'Add a concise, keyword-rich `<title>` tag inside your HTML `<head>` section.',
      codeSnippet: `<head>\n  <title>Your Primary Keyword | Brand Name</title>\n</head>`
    });
  } else if (titleText.length < 30 || titleText.length > 65) {
    score -= 10;
    issues.push({
      id: 'seo-suboptimal-title-length',
      category: 'SEO',
      title: `Suboptimal Title Length (${titleText.length} characters)`,
      severity: 'warning',
      description: `Current title "${titleText.substring(0, 40)}..." is ${titleText.length < 30 ? 'too short' : 'too long'}. Recommended length is 30–60 characters.`,
      businessImpact: 'Search engine title snippets may be truncated in Google search result pages (SERPs), lowering user click-through rates (CTR).',
      recommendation: 'Adjust title text length to between 30 and 60 characters for optimal SERP display.',
      codeSnippet: `<title>Optimized Title for High Click-Through Rate (50 chars)</title>`
    });
  } else {
    issues.push({
      id: 'seo-title-passed',
      category: 'SEO',
      title: 'Optimal Page Title Tag Found',
      severity: 'passed',
      description: `Found well-crafted title tag: "${titleText}" (${titleText.length} characters).`,
      businessImpact: 'Helps Google display your brand title clearly in search listings.',
      recommendation: 'Maintain current title tag formatting.'
    });
  }

  // 2. Meta Description Check
  const metaDesc = $('meta[name="description"]').attr('content')?.trim();
  if (!metaDesc) {
    score -= 20;
    issues.push({
      id: 'seo-no-meta-description',
      category: 'SEO',
      title: 'Missing Meta Description Tag',
      severity: 'critical',
      description: 'No `<meta name="description">` tag detected.',
      businessImpact: 'Can significantly reduce click-through rates from search results. Google will pick random content snippets from your page instead of your sales pitch.',
      recommendation: 'Add a compelling 120-160 character meta description summarizing your site value proposition.',
      codeSnippet: `<meta name="description" content="Discover premium web audit tools to boost your search rankings, fix critical vulnerabilities, and double client conversion rates.">`
    });
  } else if (metaDesc.length < 70 || metaDesc.length > 165) {
    score -= 10;
    issues.push({
      id: 'seo-suboptimal-meta-desc-length',
      category: 'SEO',
      title: `Suboptimal Meta Description Length (${metaDesc.length} characters)`,
      severity: 'warning',
      description: `Meta description is ${metaDesc.length < 70 ? 'too brief' : 'too long'}. Ideal length is 120–160 characters.`,
      businessImpact: 'Snippets that are too long get cut off with trailing ellipses (...), obscuring your call to action.',
      recommendation: 'Trim or expand meta description to stay between 120 and 160 characters.',
      codeSnippet: `<meta name="description" content="Concise and persuasive 140 character summary of your product or agency value proposition.">`
    });
  } else {
    issues.push({
      id: 'seo-meta-desc-passed',
      category: 'SEO',
      title: 'Meta Description Present & Well-Formed',
      severity: 'passed',
      description: `Meta description present (${metaDesc.length} chars).`,
      businessImpact: 'Provides a polished preview snippet in Google search results.',
      recommendation: 'Keep content aligned with target page keywords.'
    });
  }

  // 3. H1 Heading Tag Check
  const h1s = $('h1');
  if (h1s.length === 0) {
    score -= 15;
    issues.push({
      id: 'seo-no-h1',
      category: 'SEO',
      title: 'Missing H1 Heading Tag',
      severity: 'critical',
      description: 'The page does not contain any `<h1>` headline tag.',
      businessImpact: 'Search engine crawlers rely heavily on `<h1>` tags to identify the core focus of your landing page.',
      recommendation: 'Include exactly one main `<h1>` headline tag containing your primary value keyword.',
      codeSnippet: `<h1>Elevate Your Web Experience & Drive Growth</h1>`
    });
  } else if (h1s.length > 1) {
    score -= 10;
    issues.push({
      id: 'seo-multiple-h1',
      category: 'SEO',
      title: `Multiple H1 Tags Detected (${h1s.length} found)`,
      severity: 'warning',
description: `Page contains ${h1s.length} <h1> tags. Best practice is to have exactly 1 main H1 header.`,
      businessImpact: 'Multiple H1 tags dilute keyword signals and confuse search engine indexing hierarchy.',
      recommendation: 'Use one single `<h1>` for main page title, and secondary `<h2>`/`<h3>` tags for subheadings.',
      codeSnippet: `<!-- Keep primary title as H1 -->\n<h1>Main Page Headline</h1>\n<!-- Convert secondary titles to H2 -->\n<h2>Key Feature Highlight</h2>`
    });
  } else {
    issues.push({
      id: 'seo-h1-passed',
      category: 'SEO',
      title: 'Single H1 Heading Tag Properly Configured',
      severity: 'passed',
      description: `Found primary heading: "${h1s.first().text().trim().substring(0, 50)}"`,
      businessImpact: 'Clear semantic signal for Google topic classification.',
      recommendation: 'Ensure main headline aligns with target keywords.'
    });
  }

  // 4. Sitemap.xml & Robots.txt Check
  if (!sitemapFound) {
    score -= 15;
    issues.push({
      id: 'seo-no-sitemap',
      category: 'SEO',
      title: 'No Sitemap.xml File Detected',
      severity: 'critical',
      description: 'Unable to detect a public `/sitemap.xml` file.',
      businessImpact: 'Search engines may index pages less efficiently, causing newly updated pages or blog posts to take weeks to show up on Google.',
      recommendation: 'Generate an XML sitemap listing your website URLs and submit it to Google Search Console.',
      codeSnippet: `<!-- Example sitemap.xml structure -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://example.com/</loc>\n    <priority>1.0</priority>\n  </url>\n</urlset>`
    });
  } else {
    issues.push({
      id: 'seo-sitemap-passed',
      category: 'SEO',
      title: 'XML Sitemap File Found',
      severity: 'passed',
      description: 'Found sitemap at `/sitemap.xml` path.',
      businessImpact: 'Ensures efficient indexing of all public website pages.',
      recommendation: 'Keep sitemap automatically updated as new pages are created.'
    });
  }

  if (!robotsFound) {
    score -= 10;
    issues.push({
      id: 'seo-no-robots',
      category: 'SEO',
      title: 'No Robots.txt File Found',
      severity: 'warning',
      description: 'No `/robots.txt` file detected at root domain.',
      businessImpact: 'Crawlers will explore without guidance, potentially indexing internal search pages, dynamic parameters, or administrative routes.',
      recommendation: 'Create a `/robots.txt` file at your domain root.',
      codeSnippet: `User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml`
    });
  }

  // 5. Image Alt Attributes Coverage
  const images = $('img');
  let missingAltCount = 0;
  images.each((_, el) => {
    const alt = $(el).attr('alt');
    if (!alt || alt.trim() === '') {
      missingAltCount++;
    }
  });

  if (images.length > 0 && missingAltCount > 0) {
    const missingRatio = Math.round((missingAltCount / images.length) * 100);
    score -= missingRatio > 40 ? 15 : 10;
    issues.push({
      id: 'seo-missing-image-alt',
      category: 'SEO',
      title: `Missing Alt Text on ${missingAltCount} of ${images.length} Images (${missingRatio}%)`,
      severity: missingRatio > 50 ? 'critical' : 'warning',
      description: `${missingAltCount} images on the page lack descriptive \`alt\` text attributes.`,
      businessImpact: 'Missed opportunity for Google Image Search rankings and breaks screen reader accessibility compliance.',
      recommendation: 'Add descriptive `alt` attributes to every image explaining its visual content.',
      codeSnippet: `<img src="hero-banner.jpg" alt="Website audit dashboard showing overall SEO score and metrics">`
    });
  } else if (images.length > 0) {
    issues.push({
      id: 'seo-alt-passed',
      category: 'SEO',
      title: 'All Images Have Descriptive Alt Tags',
      severity: 'passed',
      description: `Verified alt text on all ${images.length} images.`,
      businessImpact: 'Maximizes image search traffic and ensures accessibility.',
      recommendation: 'Maintain alt tagging standards on all new uploads.'
    });
  }

  // 6. Open Graph Metadata
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  if (!ogTitle || !ogImage) {
    score -= 10;
    issues.push({
      id: 'seo-missing-og-tags',
      category: 'SEO',
      title: 'Incomplete Social Media Open Graph (OG) Tags',
      severity: 'warning',
      description: 'Missing `og:title` or `og:image` social preview metadata.',
      businessImpact: 'When shared on Twitter/X, LinkedIn, Facebook, or Slack, links will display generic text or blank image cards instead of eye-catching previews.',
      recommendation: 'Add standard Open Graph protocol tags for rich social sharing cards.',
      codeSnippet: `<meta property="og:title" content="Website Audit SaaS Tool">\n<meta property="og:description" content="Generate high converting website reports">\n<meta property="og:image" content="https://example.com/og-preview.png">`
    });
  }

  return {
    score: Math.max(10, Math.min(100, score)),
    issues
  };
}

module.exports = { auditSEO };
