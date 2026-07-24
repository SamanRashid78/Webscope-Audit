/**
 * Tech Stack Detector Service
 * Analyzes HTML content, script tags, meta tags, and HTTP headers to detect technologies.
 */
function detectTechStack(html, headers = {}, url = '') {
  const detected = [];
  const lowerHtml = html.toLowerCase();
  const lowerHeaders = JSON.stringify(headers).toLowerCase();

  // CMS Detection
  if (lowerHtml.includes('wp-content') || lowerHtml.includes('wp-includes') || lowerHtml.includes('generator" content="wordpress')) {
    detected.push({ name: 'WordPress', category: 'CMS', icon: 'wordpress', badgeColor: '#21759b' });
  }
  if (lowerHtml.includes('cdn.shopify.com') || lowerHtml.includes('shopify.theme') || lowerHtml.includes('myshopify.com')) {
    detected.push({ name: 'Shopify', category: 'E-Commerce', icon: 'shopping-bag', badgeColor: '#95bf47' });
  }
  if (lowerHtml.includes('uploads-ssl.webflow.com') || lowerHtml.includes('data-wf-page')) {
    detected.push({ name: 'Webflow', category: 'CMS / Builder', icon: 'layout', badgeColor: '#4353ff' });
  }
  if (lowerHtml.includes('static.wixstatic.com') || lowerHtml.includes('wix.com')) {
    detected.push({ name: 'Wix', category: 'Website Builder', icon: 'globe', badgeColor: '#000000' });
  }
  if (lowerHtml.includes('static1.squarespace.com')) {
    detected.push({ name: 'Squarespace', category: 'Website Builder', icon: 'square', badgeColor: '#222222' });
  }

  // Frameworks & Libraries
  if (lowerHtml.includes('_next/static') || lowerHtml.includes('__next')) {
    detected.push({ name: 'Next.js', category: 'React Framework', icon: 'code', badgeColor: '#000000' });
  } else if (lowerHtml.includes('react') || lowerHtml.includes('react-dom') || lowerHtml.includes('data-reactroot')) {
    detected.push({ name: 'React', category: 'UI Framework', icon: 'atom', badgeColor: '#61dafb' });
  }

  if (lowerHtml.includes('vue.js') || lowerHtml.includes('vue.min.js') || lowerHtml.includes('data-v-')) {
    detected.push({ name: 'Vue.js', category: 'UI Framework', icon: 'code', badgeColor: '#42b883' });
  }
  if (lowerHtml.includes('jquery.js') || lowerHtml.includes('jquery.min.js') || lowerHtml.includes('jquery/')) {
    detected.push({ name: 'jQuery', category: 'JS Library', icon: 'layers', badgeColor: '#0769ad' });
  }

  // CSS Frameworks
  if (lowerHtml.includes('tailwindcss') || lowerHtml.includes('tailwind') || lowerHtml.includes('-tw-') || lowerHtml.includes('flex items-center')) {
    detected.push({ name: 'Tailwind CSS', category: 'CSS Framework', icon: 'feather', badgeColor: '#38bdf8' });
  }
  if (lowerHtml.includes('bootstrap.min.css') || lowerHtml.includes('bootstrap.css') || lowerHtml.includes('class="btn btn-primary')) {
    detected.push({ name: 'Bootstrap', category: 'CSS Framework', icon: 'box', badgeColor: '#7952b3' });
  }

  // Analytics & Tracking
  if (lowerHtml.includes('google-analytics.com') || lowerHtml.includes('googletagmanager.com') || lowerHtml.includes('gtag(')) {
    detected.push({ name: 'Google Analytics', category: 'Analytics', icon: 'bar-chart-2', badgeColor: '#f9ab00' });
  }
  if (lowerHtml.includes('static.hotjar.com') || lowerHtml.includes('hj(')) {
    detected.push({ name: 'Hotjar', category: 'Analytics / Heatmaps', icon: 'activity', badgeColor: '#ff3c00' });
  }
  if (lowerHtml.includes('connect.facebook.net') || lowerHtml.includes('fbq(')) {
    detected.push({ name: 'Meta Pixel', category: 'Marketing', icon: 'target', badgeColor: '#0081fb' });
  }
  if (lowerHtml.includes('js.hs-scripts.com') || lowerHtml.includes('hubspot.com')) {
    detected.push({ name: 'HubSpot', category: 'CRM & Marketing', icon: 'users', badgeColor: '#ff7a59' });
  }

  // Infrastructure & CDNs & Security
  if (lowerHeaders.includes('cloudflare') || lowerHtml.includes('cloudflare.com')) {
    detected.push({ name: 'Cloudflare', category: 'CDN & Security', icon: 'shield', badgeColor: '#f38020' });
  }
  if (lowerHeaders.includes('vercel') || lowerHtml.includes('vercel.app')) {
    detected.push({ name: 'Vercel', category: 'Hosting', icon: 'server', badgeColor: '#000000' });
  }
  if (lowerHeaders.includes('netlify') || lowerHtml.includes('netlify.app')) {
    detected.push({ name: 'Netlify', category: 'Hosting', icon: 'cloud', badgeColor: '#00c7b7' });
  }

  // Payments
  if (lowerHtml.includes('js.stripe.com') || lowerHtml.includes('stripe')) {
    detected.push({ name: 'Stripe', category: 'Payments', icon: 'credit-card', badgeColor: '#635bfc' });
  }

  // Fallback defaults if none identified
  if (detected.length === 0) {
    detected.push({ name: 'HTML5 Standard', category: 'Core Web', icon: 'file-text', badgeColor: '#e34f26' });
    detected.push({ name: 'JavaScript ES6', category: 'Language', icon: 'code', badgeColor: '#f7df1e' });
  }

  return detected;
}

module.exports = { detectTechStack };
