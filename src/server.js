const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://api.github.com; script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.github.com; frame-ancestors 'none'; base-uri 'self'");
  next();
});

const publicPath = path.join(__dirname, '..', 'public');
const staticOpts = {
  setHeaders(res, filePath) {
    if (/\.(jpg|jpeg|png|gif|ico|svg|webp|css|js|woff2?|ttf|otf|eot)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, immutable, max-age=31536000');
      res.setHeader('Expires', '1y');
    }
  }
};
app.use(express.static(publicPath, staticOpts));

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'), {
    headers: { 'Cache-Control': 'no-cache, must-revalidate' }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
