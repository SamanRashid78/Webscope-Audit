const dns = require('dns').promises;
const net = require('net');

function isPrivateIp(ip) {
  if (net.isIP(ip) === 0) return false;

  if (net.isIP(ip) === 4) {
    const parts = ip.split('.').map(Number);
    const [a, b] = parts;
    if (a === 127) return true;          // loopback
    if (a === 10) return true;           // 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true;          // 192.168.0.0/16
    if (a === 169 && b === 254) return true;          // link-local, incl. 169.254.169.254 cloud metadata
    if (a === 0) return true;
    return false;
  }

  // IPv6
  const lower = ip.toLowerCase();
  if (lower === '::1') return true;
  if (lower.startsWith('fe80:')) return true; // link-local
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // unique local
  return false;
}

async function validateTargetUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch (e) {
    throw new Error('Invalid URL format.');
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only http and https URLs are allowed.');
  }

  const hostname = parsed.hostname.toLowerCase();
  if (hostname === 'localhost' || hostname === '0.0.0.0') {
    throw new Error('Scanning local/internal addresses is not allowed.');
  }

  // If the hostname is already a raw IP, check it directly
  if (net.isIP(hostname) !== 0) {
    if (isPrivateIp(hostname)) {
      throw new Error('Scanning private/internal IP addresses is not allowed.');
    }
    return parsed;
  }

  // Resolve DNS so a domain that *points to* an internal IP can't sneak through
  let addresses;
  try {
    addresses = await dns.lookup(hostname, { all: true });
  } catch (e) {
    throw new Error('Could not resolve hostname.');
  }

  for (const addr of addresses) {
    if (isPrivateIp(addr.address)) {
      throw new Error('Target domain resolves to a private/internal address and cannot be scanned.');
    }
  }

  return parsed;
}

module.exports = { validateTargetUrl };