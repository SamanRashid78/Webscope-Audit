/**
 * Security Auditor Module
 * Checks HTTPS protocol, SSL status, and security HTTP headers.
 */
function auditSecurity(headers = {}, isHttps = true, responseStatusCode = 200) {
  const issues = [];
  let score = 100;

  // Normalize header keys to lowercase
  const normHeaders = {};
  Object.keys(headers).forEach(k => {
    normHeaders[k.toLowerCase()] = headers[k];
  });

  // 1. HTTPS Protocol Check
  if (!isHttps) {
    score -= 35;
    issues.push({
      id: 'sec-no-https',
      category: 'Security',
      title: 'Insecure Connection (HTTP without SSL/TLS)',
      severity: 'critical',
      description: 'The website is served over unencrypted HTTP protocol.',
      businessImpact: 'Browsers flag the site as "Not Secure" in red, scaring away visitors and customers. Google penalizes unencrypted sites in search rankings.',
      recommendation: 'Install a valid SSL certificate (e.g. via Let\'s Encrypt or Cloudflare) and enforce HTTP to HTTPS redirects.',
      codeSnippet: `<!-- Nginx HTTPS Redirect Example -->\nserver {\n    listen 80;\n    server_name example.com;\n    return 312 https://$host$request_uri;\n}`
    });
  } else {
    issues.push({
      id: 'sec-https-passed',
      category: 'Security',
      title: 'HTTPS Encryption Enforced',
      severity: 'passed',
      description: 'Site communicates over encrypted TLS/SSL connection.',
      businessImpact: 'Protects user data in transit and maintains browser security trust badges.',
      recommendation: 'Ensure SSL auto-renewal is enabled.'
    });
  }

  // 2. Strict-Transport-Security (HSTS)
  if (!normHeaders['strict-transport-security']) {
    score -= 15;
    issues.push({
      id: 'sec-no-hsts',
      category: 'Security',
      title: 'Missing HSTS Security Header',
      severity: 'critical',
      description: 'No `Strict-Transport-Security` header provided by web server.',
      businessImpact: 'Leaves users vulnerable to SSL stripping attacks where malicious networks downgrade HTTPS connections to insecure HTTP.',
      recommendation: 'Add the HSTS response header with a long `max-age` value.',
      codeSnippet: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
    });
  } else {
    issues.push({
      id: 'sec-hsts-passed',
      category: 'Security',
      title: 'HSTS Security Header Active',
      severity: 'passed',
      description: `HSTS enabled with value: "${normHeaders['strict-transport-security']}"`,
      businessImpact: 'Prevents connection downgrade attacks.',
      recommendation: 'Maintain HSTS header configuration.'
    });
  }

  // 3. Content-Security-Policy (CSP)
  if (!normHeaders['content-security-policy']) {
    score -= 15;
    issues.push({
      id: 'sec-no-csp',
      category: 'Security',
      title: 'Missing Content Security Policy (CSP)',
      severity: 'warning',
      description: 'No `Content-Security-Policy` header detected.',
      businessImpact: 'Significantly increases risk of Cross-Site Scripting (XSS) and data injection attacks where attackers inject rogue scripts to steal session cookies or credentials.',
      recommendation: 'Configure a restrictive CSP specifying allowed script sources and origins.',
      codeSnippet: `Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com; style-src 'self' 'unsafe-inline';`
    });
  } else {
    issues.push({
      id: 'sec-csp-passed',
      category: 'Security',
      title: 'Content Security Policy (CSP) Detected',
      severity: 'passed',
      description: 'CSP header present on web server responses.',
      businessImpact: 'Mitigates unauthorized script execution and code injection.',
      recommendation: 'Periodically audit allowed CSP domain lists.'
    });
  }

  // 4. X-Frame-Options (Clickjacking Protection)
  if (!normHeaders['x-frame-options']) {
    score -= 10;
    issues.push({
      id: 'sec-no-xframe',
      category: 'Security',
      title: 'Missing Clickjacking Protection (X-Frame-Options)',
      severity: 'warning',
      description: 'No `X-Frame-Options` header found.',
      businessImpact: 'Allows attackers to embed your site inside an invisible `<iframe>` on a malicious site to trick users into clicking buttons unintendedly.',
      recommendation: 'Set `X-Frame-Options` to `DENY` or `SAMEORIGIN`.',
      codeSnippet: `X-Frame-Options: SAMEORIGIN`
    });
  } else {
    issues.push({
      id: 'sec-xframe-passed',
      category: 'Security',
      title: 'Clickjacking Protection Active',
      severity: 'passed',
      description: `X-Frame-Options configured to: ${normHeaders['x-frame-options']}`,
      businessImpact: 'Prevents malicious framing of web app UI.',
      recommendation: 'Maintain setting.'
    });
  }

  // 5. X-Content-Type-Options (MIME Sniffing)
  if (!normHeaders['x-content-type-options']) {
    score -= 10;
    issues.push({
      id: 'sec-no-nosniff',
      category: 'Security',
      title: 'Missing X-Content-Type-Options Header',
      severity: 'warning',
      description: 'Missing `X-Content-Type-Options: nosniff`.',
      businessImpact: 'Browsers may attempt to guess (sniff) content types, executing non-script files (like uploaded images) as executable scripts.',
      recommendation: 'Add `X-Content-Type-Options: nosniff` header.',
      codeSnippet: `X-Content-Type-Options: nosniff`
    });
  }

  // 6. Server Signature Information Leakage
  if (normHeaders['x-powered-by'] || (normHeaders['server'] && normHeaders['server'].match(/\d+\.\d+/))) {
    score -= 10;
    issues.push({
      id: 'sec-server-leak',
      category: 'Security',
      title: 'Server Tech Stack Version Information Leaked',
      severity: 'warning',
      description: `Server exposes internal backend details: ${normHeaders['x-powered-by'] || normHeaders['server']}`,
      businessImpact: 'Helps malicious hackers locate exact software versions and exploit unpatched security vulnerabilities in specific web server builds.',
      recommendation: 'Disable Server tokens and `X-Powered-By` headers in web server settings.',
      codeSnippet: `<!-- Express JS disable header snippet -->\napp.disable('x-powered-by');`
    });
  }

  return {
    score: Math.max(10, Math.min(100, score)),
    issues
  };
}

module.exports = { auditSecurity };
