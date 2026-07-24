/**
 * Performance Auditor Module
 * Checks load latency, payload sizes, CSS/JS asset count, DOM node count, and caching headers.
 */
function auditPerformance($, responseTimeMs, htmlBytes, headers = {}) {
  const issues = [];
  let score = 100;

  // Normalize headers
  const normHeaders = {};
  Object.keys(headers).forEach(k => {
    normHeaders[k.toLowerCase()] = headers[k];
  });

  // 1. Response Time Check (TTFB & Initial Download)
  if (responseTimeMs > 2500) {
    score -= 30;
    issues.push({
      id: 'perf-slow-response',
      category: 'Performance',
      title: `Slow Server Response Time (${responseTimeMs} ms)`,
      severity: 'critical',
      description: `Initial server HTTP response took ${responseTimeMs}ms. Recommended threshold is under 800ms.`,
      businessImpact: 'High bounce rates. Studies show 40% of users abandon a website that takes more than 3 seconds to respond.',
      recommendation: 'Optimize backend query speed, enable page caching, or use a global CDN (e.g. Cloudflare).',
      codeSnippet: `<!-- Cache-Control Header -->\nCache-Control: public, max-age=86400, s-maxage=604800`
    });
  } else if (responseTimeMs > 1000) {
    score -= 15;
    issues.push({
      id: 'perf-moderate-response',
      category: 'Performance',
      title: `Moderate Response Latency (${responseTimeMs} ms)`,
      severity: 'warning',
      description: `Server responded in ${responseTimeMs}ms. Goal should be under 800ms.`,
      businessImpact: 'Slight user delay that can impact mobile user retention and conversion rates.',
      recommendation: 'Review database queries and enable HTTP compression (Gzip/Brotli).',
      codeSnippet: `<!-- Enable Gzip compression in Nginx -->\ngzip on;\ngzip_types text/plain text/css application/json application/javascript;`
    });
  } else {
    issues.push({
      id: 'perf-fast-response',
      category: 'Performance',
      title: 'Fast Initial Server Response Time',
      severity: 'passed',
      description: `Server responded quickly in ${responseTimeMs}ms.`,
      businessImpact: 'Delivers fast initial page load and improves Google Core Web Vitals.',
      recommendation: 'Maintain server performance monitoring.'
    });
  }

  // 2. HTML Document Size
  const kbSize = Math.round(htmlBytes / 1024);
  if (kbSize > 350) {
    score -= 20;
    issues.push({
      id: 'perf-large-html',
      category: 'Performance',
      title: `Excessive HTML Document Size (${kbSize} KB)`,
      severity: 'warning',
      description: `HTML document size is ${kbSize} KB. Target document size is under 150 KB.`,
      businessImpact: 'Delays mobile parsing time and consumes user mobile data plans.',
      recommendation: 'Minify HTML markup, remove inline base64 encoded images, and paginate long lists.',
      codeSnippet: `<!-- Remove inline bloated base64 data and load assets asynchronously -->`
    });
  }

  // 3. Asset Count Check (CSS & JS bundles)
  const cssCount = $('link[rel="stylesheet"]').length;
  const jsCount = $('script[src]').length;
  if (cssCount + jsCount > 18) {
    score -= 15;
    issues.push({
      id: 'perf-too-many-requests',
      category: 'Performance',
      title: `High HTTP Request Count (${cssCount} CSS, ${jsCount} JS files)`,
      severity: 'warning',
      description: `Found ${cssCount} stylesheet links and ${jsCount} external script tags.`,
      businessImpact: 'Creates network bottlenecks and blocks critical rendering path.',
      recommendation: 'Bundle and minify CSS/JS files into consolidated production assets.',
      codeSnippet: `<!-- Combine multiple stylesheet links into a single minified CSS bundle -->`
    });
  } else {
    issues.push({
      id: 'perf-asset-count-passed',
      category: 'Performance',
      title: 'Optimal CSS/JS Asset Count',
      severity: 'passed',
      description: `Found ${cssCount} CSS links and ${jsCount} external scripts.`,
      businessImpact: 'Minimizes blocking HTTP requests during initial render.',
      recommendation: 'Continue using asset bundlers like Vite or Webpack.'
    });
  }

  // 4. DOM Node Count Heuristic
  const totalDomNodes = $('*').length;
  if (totalDomNodes > 1500) {
    score -= 15;
    issues.push({
      id: 'perf-excessive-dom',
      category: 'Performance',
      title: `Excessive DOM Node Tree (${totalDomNodes} elements)`,
      severity: 'warning',
      description: `Document contains ${totalDomNodes} DOM elements. Lighthouse recommended maximum is 1,500.`,
      businessImpact: 'Increases memory usage, causes sluggish scrolling, and slows down JavaScript DOM operations.',
      recommendation: 'Simplify deep nested `<div>` structures and implement virtualized lists or lazy loading.',
      codeSnippet: `<!-- Flatten redundant wrapper containers -->`
    });
  }

  // 5. Caching Headers Check
  const cacheControl = normHeaders['cache-control'];
  if (!cacheControl || cacheControl.includes('no-store') || cacheControl.includes('no-cache')) {
    score -= 10;
    issues.push({
      id: 'perf-no-cache',
      category: 'Performance',
      title: 'Missing Browser Caching Directives',
      severity: 'warning',
      description: 'Response lacks long-term `Cache-Control` header directives.',
      businessImpact: 'Forces returning visitors to download static assets on every single page view, degrading repeat visit speed.',
      recommendation: 'Configure `Cache-Control` headers for static web assets.',
      codeSnippet: `Cache-Control: public, max-age=31536000, immutable`
    });
  }

  return {
    score: Math.max(10, Math.min(100, score)),
    issues
  };
}

module.exports = { auditPerformance };
