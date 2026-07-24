/**
 * Client Performance Auditor Module
 */
function clientAuditPerformance(doc, htmlText, responseTimeMs, headersObj = {}) {
  const issues = [];
  let score = 100;

  // Response Time
  if (responseTimeMs > 2500) {
    score -= 30;
    issues.push({
      id: 'perf-slow-response',
      category: 'Performance',
      title: `Slow Response Time (${responseTimeMs} ms)`,
      severity: 'critical',
      description: `Initial response took ${responseTimeMs}ms. Recommended threshold is under 800ms.`,
      businessImpact: 'High bounce rates. Studies show 40% of users abandon a website that takes over 3 seconds to respond.',
      recommendation: 'Optimize backend query speed and use global CDN caching.',
      codeSnippet: `Cache-Control: public, max-age=86400`
    });
  } else if (responseTimeMs > 1000) {
    score -= 15;
    issues.push({
      id: 'perf-moderate-response',
      category: 'Performance',
      title: `Moderate Response Latency (${responseTimeMs} ms)`,
      severity: 'warning',
      description: `Server responded in ${responseTimeMs}ms. Ideal is under 800ms.`,
      businessImpact: 'User delay impacting mobile user retention and conversion rates.',
      recommendation: 'Enable page caching and Gzip/Brotli compression.',
      codeSnippet: `gzip on;\ngzip_types text/plain text/css application/javascript;`
    });
  } else {
    issues.push({
      id: 'perf-fast-response',
      category: 'Performance',
      title: 'Fast Initial Server Response Time',
      severity: 'passed',
      description: `Server responded in ${responseTimeMs}ms.`,
      businessImpact: 'Delivers fast initial page load and improves Google Core Web Vitals.',
      recommendation: 'Maintain server performance monitoring.'
    });
  }

  // CSS and JS asset counts
  const cssCount = doc.querySelectorAll('link[rel="stylesheet"]').length;
  const jsCount = doc.querySelectorAll('script[src]').length;

  if (cssCount + jsCount > 18) {
    score -= 15;
    issues.push({
      id: 'perf-high-request-count',
      category: 'Performance',
      title: `High Asset Request Count (${cssCount} CSS, ${jsCount} JS files)`,
      severity: 'warning',
      description: `Found ${cssCount} CSS links and ${jsCount} JS script files.`,
      businessImpact: 'Creates network bottlenecks and blocks critical rendering path.',
      recommendation: 'Bundle and minify CSS/JS into consolidated production files.',
      codeSnippet: `<!-- Combine CSS stylesheet links into a minified bundle -->`
    });
  } else {
    issues.push({
      id: 'perf-asset-count-passed',
      category: 'Performance',
      title: 'Optimal Asset Bundle Count',
      severity: 'passed',
      description: `Found ${cssCount} CSS links and ${jsCount} script files.`,
      businessImpact: 'Minimizes blocking HTTP requests during render.',
      recommendation: 'Continue asset minification.'
    });
  }

  // DOM Nodes
  const totalDomNodes = doc.querySelectorAll('*').length;
  if (totalDomNodes > 1500) {
    score -= 15;
    issues.push({
      id: 'perf-large-dom',
      category: 'Performance',
      title: `Excessive DOM Elements (${totalDomNodes} nodes)`,
      severity: 'warning',
      description: `Page contains ${totalDomNodes} DOM elements. Lighthouse target is under 1,500.`,
      businessImpact: 'Increases browser memory usage and slows down scroll performance.',
      recommendation: 'Simplify nested markup structures and lazy-load offscreen elements.',
      codeSnippet: `<!-- Flatten redundant wrapper div containers -->`
    });
  }

  return {
    score: Math.max(10, Math.min(100, score)),
    issues
  };
}
