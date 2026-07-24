/**
 * Client Tech Stack Detector Module
 */
function clientDetectTechStack(htmlText = '', headersObj = {}, url = '') {
  const detected = [];
  const lowerHtml = htmlText.toLowerCase();
  const lowerHeaders = JSON.stringify(headersObj).toLowerCase();

  // CMS
  if (lowerHtml.includes('wp-content') || lowerHtml.includes('wp-includes') || lowerHtml.includes('wordpress')) {
    detected.push({ name: 'WordPress', category: 'CMS', badgeColor: '#21759b' });
  }
  if (lowerHtml.includes('cdn.shopify.com') || lowerHtml.includes('shopify') || lowerHtml.includes('myshopify')) {
    detected.push({ name: 'Shopify', category: 'E-Commerce', badgeColor: '#95bf47' });
  }
  if (lowerHtml.includes('webflow') || lowerHtml.includes('uploads-ssl.webflow.com')) {
    detected.push({ name: 'Webflow', category: 'CMS / Builder', badgeColor: '#4353ff' });
  }
  if (lowerHtml.includes('wix.com') || lowerHtml.includes('wixstatic')) {
    detected.push({ name: 'Wix', category: 'Website Builder', badgeColor: '#000000' });
  }
  if (lowerHtml.includes('squarespace')) {
    detected.push({ name: 'Squarespace', category: 'Website Builder', badgeColor: '#222222' });
  }

  // Frameworks
  if (lowerHtml.includes('_next/static') || lowerHtml.includes('__next')) {
    detected.push({ name: 'Next.js', category: 'React Framework', badgeColor: '#000000' });
  } else if (lowerHtml.includes('react') || lowerHtml.includes('data-reactroot')) {
    detected.push({ name: 'React', category: 'UI Framework', badgeColor: '#61dafb' });
  }

  if (lowerHtml.includes('vue.js') || lowerHtml.includes('data-v-')) {
    detected.push({ name: 'Vue.js', category: 'UI Framework', badgeColor: '#42b883' });
  }
  if (lowerHtml.includes('jquery')) {
    detected.push({ name: 'jQuery', category: 'JS Library', badgeColor: '#0769ad' });
  }

  // Styling
  if (lowerHtml.includes('tailwind') || lowerHtml.includes('flex items-center')) {
    detected.push({ name: 'Tailwind CSS', category: 'CSS Framework', badgeColor: '#38bdf8' });
  }
  if (lowerHtml.includes('bootstrap')) {
    detected.push({ name: 'Bootstrap', category: 'CSS Framework', badgeColor: '#7952b3' });
  }

  // Analytics & Marketing
  if (lowerHtml.includes('google-analytics') || lowerHtml.includes('googletagmanager') || lowerHtml.includes('gtag')) {
    detected.push({ name: 'Google Analytics', category: 'Analytics', badgeColor: '#f9ab00' });
  }
  if (lowerHtml.includes('hotjar') || lowerHtml.includes('hj(')) {
    detected.push({ name: 'Hotjar', category: 'Analytics / Heatmaps', badgeColor: '#ff3c00' });
  }
  if (lowerHtml.includes('connect.facebook.net') || lowerHtml.includes('fbq')) {
    detected.push({ name: 'Meta Pixel', category: 'Marketing', badgeColor: '#0081fb' });
  }

  // Infrastructure & CDN
  if (lowerHeaders.includes('cloudflare') || lowerHtml.includes('cloudflare')) {
    detected.push({ name: 'Cloudflare', category: 'CDN & Security', badgeColor: '#f38020' });
  }
  if (lowerHeaders.includes('vercel') || lowerHtml.includes('vercel')) {
    detected.push({ name: 'Vercel', category: 'Hosting', badgeColor: '#000000' });
  }

  // Payments
  if (lowerHtml.includes('stripe')) {
    detected.push({ name: 'Stripe', category: 'Payments', badgeColor: '#635bfc' });
  }

  if (detected.length === 0) {
    detected.push({ name: 'HTML5 Modern Standard', category: 'Core Web', badgeColor: '#e34f26' });
    detected.push({ name: 'JavaScript ES6', category: 'Language', badgeColor: '#f7df1e' });
  }

  return detected;
}
