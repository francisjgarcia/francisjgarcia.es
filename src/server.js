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
  next();
});

const publicPath = path.join(__dirname, '..', 'public');
const staticOpts = {
  setHeaders(res, filePath) {
    if (/\.(jpg|jpeg|png|gif|ico|svg|webp|css|js|woff2?|ttf|otf|eot)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, immutable');
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
