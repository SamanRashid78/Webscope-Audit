/**
 * Master Audit Coordinator (Client Side) - calls the real backend API
 */
async function runWebsiteAudit(targetUrl, progressCallback = () => {}) {
  let formattedUrl = targetUrl.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl;
  }

  const API_BASE = 'http://localhost:5000';

  progressCallback('m-http', 'active');

  const response = await fetch(`${API_BASE}/api/audit?url=${encodeURIComponent(formattedUrl)}`);

  progressCallback('m-http', 'done');
  progressCallback('m-tech', 'active');

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Audit failed with status ${response.status}`);
  }

  const data = await response.json();

  progressCallback('m-tech', 'done');
  progressCallback('m-seo', 'active');
  progressCallback('m-seo', 'done');
  progressCallback('m-sec', 'active');
  progressCallback('m-sec', 'done');
  progressCallback('m-lead', 'active');
  progressCallback('m-lead', 'done');

  return data;
}