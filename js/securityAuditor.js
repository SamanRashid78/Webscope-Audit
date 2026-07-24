/**
 * Client Security Auditor Module
 */
function clientAuditSecurity(headersObj = {}, isHttps = true) {
  const issues = [];
  let score = 100;

  const normHeaders = {};
  Object.keys(headersObj).forEach(k => {
    normHeaders[k.toLowerCase()] = headersObj[k];
  });

  // HTTPS
  if (!isHttps) {
    score -= 35;
    issues.push({
      id: 'sec-no-https',
      category: 'Security',
      title: 'Insecure Connection (HTTP without SSL/TLS)',
      severity: 'critical',
      description: 'The website communicates over unencrypted HTTP.',
      businessImpact: 'Browsers flag the site as "Not Secure" in red, scaring away visitors and customers. Google penalizes unencrypted sites in search rankings.',
      recommendation: 'Install an SSL certificate and redirect HTTP traffic to HTTPS.',
      codeSnippet: `<!-- Nginx HTTPS Redirect -->\nserver {\n    listen 80;\n    server_name example.com;\n    return 312 https://$host$request_uri;\n}`
    });
  } else {
    issues.push({
      id: 'sec-https-passed',
      category: 'Security',
      title: 'HTTPS Encryption Active',
      severity: 'passed',
      description: 'Website uses encrypted SSL/TLS connection.',
      businessImpact: 'Protects user data and maintains browser trust indicators.',
      recommendation: 'Maintain SSL certificate auto-renewal.'
    });
  }

  // HSTS Header
  if (!normHeaders['strict-transport-security']) {
    score -= 15;
    issues.push({
      id: 'sec-no-hsts',
      category: 'Security',
      title: 'Missing HSTS Security Header',
      severity: 'critical',
      description: 'No `Strict-Transport-Security` header provided by server.',
      businessImpact: 'Leaves users vulnerable to SSL stripping attacks where malicious networks downgrade HTTPS to insecure HTTP.',
      recommendation: 'Add HSTS response header with a long `max-age`.',
      codeSnippet: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
    });
  } else {
    issues.push({
      id: 'sec-hsts-passed',
      category: 'Security',
      title: 'HSTS Header Configured',
      severity: 'passed',
      description: 'Strict-Transport-Security header present.',
      businessImpact: 'Prevents SSL stripping attacks.',
      recommendation: 'Maintain settings.'
    });
  }

  // CSP
  if (!normHeaders['content-security-policy']) {
    score -= 15;
    issues.push({
      id: 'sec-no-csp',
      category: 'Security',
      title: 'Missing Content Security Policy (CSP)',
      severity: 'warning',
      description: 'No `Content-Security-Policy` header detected.',
      businessImpact: 'Increases risk of Cross-Site Scripting (XSS) and script injection attacks.',
      recommendation: 'Configure a restrictive CSP specifying allowed script origins.',
      codeSnippet: `Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com;`
    });
  }

  // X-Frame-Options
  if (!normHeaders['x-frame-options']) {
    score -= 10;
    issues.push({
      id: 'sec-no-xframe',
      category: 'Security',
      title: 'Missing Clickjacking Protection (X-Frame-Options)',
      severity: 'warning',
      description: 'No `X-Frame-Options` header found.',
      businessImpact: 'Allows attackers to embed your site in an invisible iframe to trick users into unintended clicks.',
      recommendation: 'Set `X-Frame-Options: SAMEORIGIN`.',
      codeSnippet: `X-Frame-Options: SAMEORIGIN`
    });
  }

  return {
    score: Math.max(10, Math.min(100, score)),
    issues
  };
}
