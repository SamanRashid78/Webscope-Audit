/**
 * Client Health Auditor Module
 */
function clientAuditHealth(doc, htmlText, url) {
  const issues = [];
  let score = 100;

  // 1. Favicon
  const faviconTag = doc.querySelector('link[rel*="icon"]');
  if (!faviconTag) {
    score -= 15;
    issues.push({
      id: 'health-no-favicon',
      category: 'Health',
      title: 'Missing Website Favicon',
      severity: 'warning',
      description: 'No `<link rel="icon">` shortcut icon tag found.',
      businessImpact: 'Browsers display a generic blank document icon in user tab bars, reducing brand recognition.',
      recommendation: 'Add a standard 32x32 `.png` or `.ico` favicon link tag.',
      codeSnippet: `<link rel="icon" type="image/png" href="/favicon.png">`
    });
  } else {
    issues.push({
      id: 'health-favicon-passed',
      category: 'Health',
      title: 'Website Favicon Configured',
      severity: 'passed',
      description: 'Favicon link present.',
      businessImpact: 'Enhances brand identity across browser tabs.',
      recommendation: 'Maintain favicon quality.'
    });
  }

  // 2. Contact Info (Email / Phone / Contact Page Link)
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const emailsFound = htmlText.match(emailRegex) || [];
  const hasContactLink = doc.querySelector('a[href*="contact"]') !== null || doc.querySelector('a[href*="about"]') !== null;

  if (emailsFound.length === 0 && !hasContactLink) {
    score -= 20;
    issues.push({
      id: 'health-no-contact-info',
      category: 'Health',
      title: 'No Direct Contact Information Found',
      severity: 'critical',
      description: 'Unable to detect email address or contact page links.',
      businessImpact: 'High customer dropoff! Prospective buyers cannot reach out, resulting in lost sales leads and lower credibility.',
      recommendation: 'Display your contact email, phone, or clear Contact Us link in header and footer.',
      codeSnippet: `<div class="footer-contact">\n  <p>Email: contact@yourdomain.com</p>\n</div>`
    });
  } else {
    issues.push({
      id: 'health-contact-passed',
      category: 'Health',
      title: 'Contact Details Detected',
      severity: 'passed',
      description: 'Found contact details or contact page link.',
      businessImpact: 'Builds immediate credibility and enables customer inquiries.',
      recommendation: 'Ensure contact details remain accurate.'
    });
  }

  // 3. Social Media Links
  const socialDomains = ['linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'github.com'];
  let socialFound = 0;
  doc.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (socialDomains.some(d => href.includes(d))) {
      socialFound++;
    }
  });

  if (socialFound === 0) {
    score -= 10;
    issues.push({
      id: 'health-no-social-links',
      category: 'Health',
      title: 'No Social Media Profile Links Found',
      severity: 'warning',
      description: 'No outbound links to LinkedIn, Twitter/X, or Facebook profiles.',
      businessImpact: 'Missed opportunity to build social proof and cross-channel brand engagement.',
      recommendation: 'Link official company social media handles in your website footer.',
      codeSnippet: `<a href="https://linkedin.com/company/yourbrand" target="_blank">LinkedIn</a>`
    });
  }

  // 4. Broken / Unconfigured Contact Forms
  const forms = doc.querySelectorAll('form');
  let brokenForms = 0;
  forms.forEach(form => {
    const action = form.getAttribute('action');
    const inputs = form.querySelectorAll('input, textarea');
    if (inputs.length > 0 && !action && !form.getAttribute('onsubmit')) {
      brokenForms++;
    }
  });

  if (brokenForms > 0) {
    score -= 20;
    issues.push({
      id: 'health-broken-form',
      category: 'Health',
      title: 'Unconfigured Contact Form Detected',
      severity: 'critical',
      description: 'Web form found without an `action` destination or submit handler.',
      businessImpact: 'Submissions fail silently! Leads submitting inquiries experience broken forms and abandon your service.',
      recommendation: 'Connect form actions to a backend handler or submission API.',
      codeSnippet: `<form action="/api/contact" method="POST">\n  <input type="email" name="email" required />\n  <button type="submit">Submit Inquiry</button>\n</form>`
    });
  }

  return {
    score: Math.max(10, Math.min(100, score)),
    issues
  };
}
