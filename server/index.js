const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { performFullAudit } = require('./services/auditEngine');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Requests from file:// pages send Origin: null (or no header at all)
    if (!origin || origin === 'null' || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

const auditLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many audit requests from this IP. Please try again later.' }
});

app.use('/api/audit', auditLimiter);
app.use('/api/compare', auditLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Website Audit Platform API', timestamp: new Date().toISOString() });
});

// Single URL Audit Endpoint
app.get('/api/audit', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing target URL parameter.' });
  }

  try {
    const result = await performFullAudit(targetUrl);
    res.json(result);
  } catch (error) {
    console.error('Audit Engine Error:', error);
    res.status(500).json({ error: 'Failed to complete audit for specified URL.', details: error.message });
  }
});

// Competitor Comparison Endpoint (Compares 2 URLs)
app.post('/api/compare', async (req, res) => {
  const { urlA, urlB } = req.body;
  if (!urlA || !urlB) {
    return res.status(400).json({ error: 'Both urlA and urlB parameters are required for comparison.' });
  }

  try {
    const [resultA, resultB] = await Promise.all([
      performFullAudit(urlA),
      performFullAudit(urlB)
    ]);

    res.json({
      siteA: resultA,
      siteB: resultB,
      winner: resultA.overallScore >= resultB.overallScore ? resultA.hostname : resultB.hostname,
      scoreDiff: Math.abs(resultA.overallScore - resultB.overallScore)
    });
  } catch (error) {
    console.error('Comparison Error:', error);
    res.status(500).json({ error: 'Failed to perform comparison.', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Website Audit Server running on http://localhost:${PORT}`);
});
