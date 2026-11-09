import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static assets from built dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoints for OpenShift probes
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.get('/healthz.php', (req, res) => {
  res.status(200).send('OK');
});

// SPA fallback for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Thanima platform production server running on port ${PORT}`);
});
