/**
 * Client SEO Auditor Module
 */
function clientAuditSEO(doc, htmlText, robotsFound, sitemapFound, url) {
  const issues = [];
  let score = 100;

  // Title
  const titleTag = doc.querySelector('title');
  const titleText = titleTag ? titleTag.textContent.trim() : '';

  if (!titleText) {
    score -= 20;
    issues.push({
      id: 'seo-no-title',
      category: 'SEO',
      title: 'Missing Page Title Tag',
      severity: 'critical',
      description: 'No `<title>` tag detected in page head.',
      businessImpact: 'Severe drop in search engine ranking. Search engines cannot display a clickable headline in Google, losing huge potential traffic.',
      recommendation: 'Add a concise keyword-rich `<title>` tag inside `<head>`.',
      codeSnippet: `<head>\n  <title>Your Primary Keyword | Brand Name</title>\n</head>`
    });
  } else if (titleText.length < 30 || titleText.length > 65) {
    score -= 10;
    issues.push({
      id: 'seo-suboptimal-title-length',
      category: 'SEO',
      title: `Suboptimal Title Length (${titleText.length} characters)`,
      severity: 'warning',
      description: `Current title "${titleText.substring(0, 35)}..." is ${titleText.length < 30 ? 'too short' : 'too long'}. Recommended: 30–60 chars.`,
      businessImpact: 'Search engine title snippets may be truncated in Google search results, lowering click-through rates (CTR).',
      recommendation: 'Adjust title text length to between 30 and 60 characters.',
      codeSnippet: `<title>Optimized Title for High Click-Through Rate (50 chars)</title>`
    });
  } else {
    issues.push({
      id: 'seo-title-passed',
      category: 'SEO',
      title: 'Optimal Page Title Tag Found',
      severity: 'passed',
      description: `Found title: "${titleText}" (${titleText.length} chars).`,
      businessImpact: 'Helps Google display your brand title clearly in search listings.',
      recommendation: 'Maintain title tag format.'
    });
  }

  // Meta Description
  const metaDescTag = doc.querySelector('meta[name="description"]');
  const metaDesc = metaDescTag ? metaDescTag.getAttribute('content')?.trim() : '';

  if (!metaDesc) {
    score -= 20;
    issues.push({
      id: 'seo-no-meta-description',
      category: 'SEO',
      title: 'Missing Meta Description Tag',
      severity: 'critical',
      description: 'No `<meta name="description">` tag detected.',
      businessImpact: 'Can significantly reduce click-through rates from search results. Google will pick random content snippets instead of your sales pitch.',
      recommendation: 'Add a 120-160 character meta description summarizing your site value proposition.',
      codeSnippet: `<meta name="description" content="Discover premium web audit tools to boost your search rankings and double client conversion rates.">`
    });
  } else if (metaDesc.length < 70 || metaDesc.length > 165) {
    score -= 10;
    issues.push({
      id: 'seo-suboptimal-meta-desc-length',
      category: 'SEO',
      title: `Suboptimal Meta Description Length (${metaDesc.length} chars)`,
      severity: 'warning',
      description: `Meta description is ${metaDesc.length < 70 ? 'too brief' : 'too long'}. Target: 120–160 characters.`,
      businessImpact: 'Snippets get cut off in Google search with trailing ellipses, obscuring your call to action.',
      recommendation: 'Adjust description length to 120–160 characters.',
      codeSnippet: `<meta name="description" content="Concise and persuasive 140 character summary of your product or service value proposition.">`
    });
  } else {
    issues.push({
      id: 'seo-meta-desc-passed',
      category: 'SEO',
      title: 'Meta Description Present & Well-Formed',
      severity: 'passed',
      description: `Description present (${metaDesc.length} chars).`,
      businessImpact: 'Provides a polished preview snippet in Google search results.',
      recommendation: 'Keep description aligned with target keywords.'
    });
  }

  // H1 Heading
  const h1s = doc.querySelectorAll('h1');
  if (h1s.length === 0) {
    score -= 15;
    issues.push({
      id: 'seo-no-h1',
      category: 'SEO',
      title: 'Missing H1 Heading Tag',
      severity: 'critical',
      description: 'No `<h1>` headline tag found on page.',
      businessImpact: 'Search engine crawlers rely on `<h1>` tags to identify the core topic of your page.',
      recommendation: 'Include exactly one main `<h1>` headline tag with primary target keyword.',
      codeSnippet: `<h1>Elevate Your Business & Drive Customer Growth</h1>`
    });
  } else if (h1s.length > 1) {
    score -= 10;
    issues.push({
      id: 'seo-multiple-h1',
      category: 'SEO',
      title: `Multiple H1 Tags Detected (${h1s.length} found)`,
      severity: 'warning',
      description: `Page contains ${h1s.length} `<h1>` tags.`,
      businessImpact: 'Multiple H1 tags dilute keyword signals and confuse search engine indexing hierarchy.',
      recommendation: 'Use one single `<h1>` for primary title and secondary `<h2>` tags for sections.',
      codeSnippet: `<h1>Main Title</h1>\n<h2>Section Subtitle</h2>`
    });
  } else {
    issues.push({
      id: 'seo-h1-passed',
      category: 'SEO',
      title: 'Single H1 Heading Tag Configured',
      severity: 'passed',
      description: `Found primary heading: "${h1s[0].textContent.trim().substring(0, 45)}"`,
      businessImpact: 'Clear semantic signal for Google topic classification.',
      recommendation: 'Ensure headline aligns with keywords.'
    });
  }

  // Sitemap & Robots
  if (!sitemapFound) {
    score -= 15;
    issues.push({
      id: 'seo-no-sitemap',
      category: 'SEO',
      title: 'No Sitemap.xml File Detected',
      severity: 'critical',
      description: 'Unable to verify `/sitemap.xml` file.',
      businessImpact: 'Search engines may index pages less efficiently, causing newly updated pages or blog posts to take weeks to show up on Google.',
      recommendation: 'Generate an XML sitemap and submit to Google Search Console.',
      codeSnippet: `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${url}</loc>\n    <priority>1.0</priority>\n  </url>\n</urlset>`
    });
  }

  // Image Alt Tags
  const imgs = doc.querySelectorAll('img');
  let missingAlt = 0;
  imgs.forEach(img => {
    const alt = img.getAttribute('alt');
    if (!alt || alt.trim() === '') missingAlt++;
  });

  if (imgs.length > 0 && missingAlt > 0) {
    const ratio = Math.round((missingAlt / imgs.length) * 100);
    score -= ratio > 40 ? 15 : 10;
    issues.push({
      id: 'seo-missing-image-alt',
      category: 'SEO',
      title: `Missing Alt Text on ${missingAlt} of ${imgs.length} Images (${ratio}%)`,
      severity: ratio > 50 ? 'critical' : 'warning',
      description: `${missingAlt} images lack descriptive \`alt\` text.`,
      businessImpact: 'Missed opportunity for Google Image Search rankings and limits accessibility compliance.',
      recommendation: 'Add descriptive `alt` attributes to every image.',
      codeSnippet: `<img src="product.jpg" alt="Description of visual content for search and accessibility">`
    });
  }

  return {
    score: Math.max(10, Math.min(100, score)),
    issues
  };
}
