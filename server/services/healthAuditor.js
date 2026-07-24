/**
 * General Health Auditor Module
 * Checks favicon, contact info, social links, contact forms, and general site health indicators.
 */
function auditHealth($, html, url) {
  const issues = [];
  let score = 100;

  // 1. Favicon Check
  const favicon = $('link[rel*="icon"]').attr('href');
  if (!favicon) {
    score -= 15;
    issues.push({
      id: 'health-no-favicon',
      category: 'Health',
      title: 'Missing Website Favicon',
      severity: 'warning',
      description: 'No `<link rel="icon">` shortcut icon tag found in the HTML `<head>`.',
      businessImpact: 'Browsers display a generic blank document icon in user tab bars, reducing brand recognition and trust.',
      recommendation: 'Add a standard 32x32 `.png` or `.ico` favicon link tag.',
      codeSnippet: `<link rel="icon" type="image/png" href="/favicon.png">`
    });
  } else {
    issues.push({
      id: 'health-favicon-passed',
      category: 'Health',
      title: 'Website Favicon Configured',
      severity: 'passed',
      description: `Favicon link present: "${favicon.substring(0, 40)}"`,
      businessImpact: 'Enhances brand identity across browser tabs and mobile bookmarks.',
      recommendation: 'Keep favicon up to date.'
    });
  }

  // 2. Contact Information Availability (Email / Phone Detection)
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  
  const emailsFound = html.match(emailRegex) || [];
  const phonesFound = html.match(phoneRegex) || [];
  const hasContactPageLink = $('a[href*="contact"]').length > 0 || $('a[href*="about"]').length > 0;

  if (emailsFound.length === 0 && phonesFound.length === 0 && !hasContactPageLink) {
    score -= 20;
    issues.push({
      id: 'health-no-contact-info',
      category: 'Health',
      title: 'No Direct Contact Information Found',
      severity: 'critical',
      description: 'Unable to detect phone numbers, email addresses, or contact page links.',
      businessImpact: 'High customer dropoff! Prospective buyers cannot easily reach out, resulting in lost sales leads and lower credibility.',
      recommendation: 'Display your contact email, business phone, or clear "Contact Us" link in the header and footer.',
      codeSnippet: `<!-- Footer Contact Info Example -->\n<div class="footer-contact">\n  <p>Email: contact@yourdomain.com</p>\n  <p>Phone: +1 (800) 555-0199</p>\n</div>`
    });
  } else {
    issues.push({
      id: 'health-contact-passed',
      category: 'Health',
      title: 'Contact Information Detected',
      severity: 'passed',
      description: `Detected contact info (${emailsFound.length > 0 ? 'Email found' : ''} ${hasContactPageLink ? 'Contact link found' : ''}).`,
      businessImpact: 'Builds immediate credibility and enables direct customer inquiries.',
      recommendation: 'Ensure contact details remain accurate.'
    });
  }

  // 3. Social Media Presence
  const socialDomains = ['linkedin.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'github.com', 'youtube.com'];
  let socialLinksFound = 0;
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (socialDomains.some(d => href.includes(d))) {
      socialLinksFound++;
    }
  });

  if (socialLinksFound === 0) {
    score -= 10;
    issues.push({
      id: 'health-no-social-links',
      category: 'Health',
      title: 'No Social Media Profile Links Detected',
      severity: 'warning',
      description: 'No outbound links to LinkedIn, Twitter/X, Facebook, or Instagram profiles.',
      businessImpact: 'Missed opportunity to build social proof, cross-channel engagement, and brand trust.',
      recommendation: 'Link official company social media handles in your website footer.',
      codeSnippet: `<a href="https://linkedin.com/company/yourbrand" target="_blank" rel="noopener noreferrer">LinkedIn</a>`
    });
  }

  // 4. Form Functionality & Input Check
  const forms = $('form');
  let incompleteForms = 0;
  forms.each((_, el) => {
    const action = $(el).attr('action');
    const inputs = $(el).find('input, textarea, select');
    if (inputs.length > 0 && !action && !$(el).attr('onSubmit')) {
      incompleteForms++;
    }
  });

  if (incompleteForms > 0) {
    score -= 20;
    issues.push({
      id: 'health-broken-form',
      category: 'Health',
      title: `Unconfigured Contact Form Detected (${incompleteForms} form)`,
      severity: 'critical',
      description: `${incompleteForms} web form found without an \`action\` destination or submit handler.`,
      businessImpact: 'Submissions fail silently! Leads submitting inquiries will experience broken forms and abandon your service.',
      recommendation: 'Connect form actions to a backend handler or submission API service (e.g. Formspree or custom API).',
      codeSnippet: `<form action="/api/contact" method="POST">\n  <input type="email" name="email" required />\n  <button type="submit">Submit</button>\n</form>`
    });
  } else if (forms.length > 0) {
    issues.push({
      id: 'health-form-passed',
      category: 'Health',
      title: 'Interactive Form Correctly Configured',
      severity: 'passed',
      description: `Verified ${forms.length} interactive form element(s).`,
      businessImpact: 'Captures incoming leads seamlessly.',
      recommendation: 'Test form deliverability periodically.'
    });
  }

  // 5. Link Integrity Check
  const totalLinks = $('a[href]').length;
  const brokenSyntaxLinks = $('a[href="#"], a[href="javascript:void(0)"], a[href=""]').length;
  if (totalLinks > 0 && brokenSyntaxLinks > 4) {
    score -= 10;
    issues.push({
      id: 'health-stub-links',
      category: 'Health',
      title: `Placeholder / Stub Links Found (${brokenSyntaxLinks} links)`,
      severity: 'warning',
      description: `Found ${brokenSyntaxLinks} links using blank \`href="#"\` or empty targets.`,
      businessImpact: 'Frustrates visitors when clicking navigation links that do nothing or reset scroll positions.',
      recommendation: 'Replace stub links with valid destination URLs or appropriate `<button>` components.',
      codeSnippet: `<!-- Use real URLs or semantic buttons -->\n<button type="button" onclick="openModal()">Action</button>`
    });
  }

  return {
    score: Math.max(10, Math.min(100, score)),
    issues
  };
}

module.exports = { auditHealth };
