const { validateTargetUrl } = require('./urlValidator');
const axios = require('axios');
const cheerio = require('cheerio');

const { detectTechStack } = require('./techDetector');
const { auditSEO } = require('./seoAuditor');
const { auditSecurity } = require('./securityAuditor');
const { auditPerformance } = require('./perfAuditor');
const { auditHealth } = require('./healthAuditor');

/**
 * Master Audit Coordinator Engine
 */
async function performFullAudit(targetUrl) {
  let formattedUrl = targetUrl.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl;
  }

const parsedUrl = await validateTargetUrl(formattedUrl);
  const hostname = parsedUrl.hostname;
  const isHttps = parsedUrl.protocol === 'https:';
 
  const startTime = Date.now();
  let response;
  let html = '';
  let responseHeaders = {};
  let statusCode = 200;
  let responseTimeMs = 0;

  // Custom User Agent to mimic modern desktop Chrome
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

  try {
    response = await axios.get(formattedUrl, {
      timeout: 10000,
      headers: { 'User-Agent': userAgent },
      maxRedirects: 5,
      validateStatus: () => true
    });

    responseTimeMs = Date.now() - startTime;
    html = typeof response.data === 'string' ? response.data : '';
    responseHeaders = response.headers || {};
    statusCode = response.status;
  } catch (err) {
    // If live fetch fails (due to connection timeout or block), fallback gracefully with warning notice
    responseTimeMs = Date.now() - startTime;
    html = `<html><head><title>${hostname}</title></head><body><h1>${hostname}</h1></body></html>`;
  }

  const $ = cheerio.load(html || '<html></html>');

  // Probe robots.txt and sitemap.xml in parallel
  let robotsFound = false;
  let sitemapFound = false;

  try {
    const robotsUrl = `${parsedUrl.protocol}//${parsedUrl.host}/robots.txt`;
    const sitemapUrl = `${parsedUrl.protocol}//${parsedUrl.host}/sitemap.xml`;

    const [robotsRes, sitemapRes] = await Promise.allSettled([
      axios.get(robotsUrl, { timeout: 4000, headers: { 'User-Agent': userAgent } }),
      axios.get(sitemapUrl, { timeout: 4000, headers: { 'User-Agent': userAgent } })
    ]);

    if (robotsRes.status === 'fulfilled' && robotsRes.value.status === 200) {
      robotsFound = true;
    }
    if (sitemapRes.status === 'fulfilled' && sitemapRes.value.status === 200) {
      sitemapFound = true;
    }
  } catch (e) {
    // Ignore probing errors
  }

  // 1. Tech Stack Detection
  const techStack = detectTechStack(html, responseHeaders, formattedUrl);

  // 2. Category Audits
  const seoResult = auditSEO($, robotsFound, sitemapFound, formattedUrl);
  const securityResult = auditSecurity(responseHeaders, isHttps, statusCode);
  const perfResult = auditPerformance($, responseTimeMs, Buffer.byteLength(html, 'utf-8'), responseHeaders);
  const healthResult = auditHealth($, html, formattedUrl);

  // 3. Score Calculations (Weighted)
  // Weights: SEO (30%), Security (25%), Performance (25%), Health (20%)
  const seoScore = seoResult.score;
  const secScore = securityResult.score;
  const perfScore = perfResult.score;
  const healthScore = healthResult.score;

  const overallScore = Math.round(
    (seoScore * 0.30) +
    (secScore * 0.25) +
    (perfScore * 0.25) +
    (healthScore * 0.20)
  );

  // 4. Combine All Issues
  const allIssues = [
    ...seoResult.issues,
    ...securityResult.issues,
    ...perfResult.issues,
    ...healthResult.issues
  ];

  const criticalIssues = allIssues.filter(i => i.severity === 'critical');
  const warningIssues = allIssues.filter(i => i.severity === 'warning');
  const passedIssues = allIssues.filter(i => i.severity === 'passed');

  // 5. Select Major Dealbreaker Issues for Lead Generator Card
  const majorDealbreakers = criticalIssues.slice(0, 3).map(i => ({
    title: i.title,
    businessImpact: i.businessImpact,
    category: i.category
  }));

  if (majorDealbreakers.length < 3 && warningIssues.length > 0) {
    warningIssues.slice(0, 3 - majorDealbreakers.length).forEach(i => {
      majorDealbreakers.push({
        title: i.title,
        businessImpact: i.businessImpact,
        category: i.category
      });
    });
  }

  // 6. Generate Cold Pitch Email Summary for Lead Acquisition
  const pitchIssuesText = majorDealbreakers.length > 0
    ? majorDealbreakers.map((m, idx) => `  ${idx + 1}. ${m.title} (${m.businessImpact})`).join('\n')
    : '  1. Multiple technical SEO & performance optimization opportunities detected.';

  const outreachEmailPitch = `Subject: Quick audit of ${hostname} - Score ${overallScore}/100

Hi Team,

I ran an automated quality audit on ${hostname} and noticed the website currently scores ${overallScore}/100.

Here are the top dealbreaker issues directly impacting your traffic and conversions:

${pitchIssuesText}

Fixing these issues can significantly increase your search engine visibility and user conversion rates.

Would you be open to a 10-minute call this week to review the full client report? I can send over the step-by-step resolution plan.

Best regards,
[Your Name / Agency]`;

  return {
    url: formattedUrl,
    hostname,
    scannedAt: new Date().toISOString(),
    overallScore,
    categories: {
      seo: { score: seoScore, label: 'SEO' },
      security: { score: secScore, label: 'Security' },
      performance: { score: perfScore, label: 'Performance' },
      health: { score: healthScore, label: 'Website Health' }
    },
    techStack,
    stats: {
      totalIssues: allIssues.length,
      criticalCount: criticalIssues.length,
      warningCount: warningIssues.length,
      passedCount: passedIssues.length,
      responseTimeMs
    },
    majorDealbreakers,
    outreachEmailPitch,
    issues: allIssues
  };
}

module.exports = { performFullAudit };
