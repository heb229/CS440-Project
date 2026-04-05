import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = 3000;

const movieServiceUrl = 'http://movie-service:3001';
const personServiceUrl = 'http://person-service:3002';
const critiqueServiceUrl = 'http://critique-service:3003';

app.use(cors());

app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/movies', createProxyMiddleware({ target: movieServiceUrl, changeOrigin: true }));
app.use('/person', createProxyMiddleware({ target: personServiceUrl, changeOrigin: true }));
app.use('/critiques', createProxyMiddleware({ target: critiqueServiceUrl, changeOrigin: true }));
app.use('/stats', createProxyMiddleware({ target: critiqueServiceUrl, changeOrigin: true }));

async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data
  };
}

app.get('/movie-full/:id', async (req, res) => {
  try {
    const movieId = req.params.id;

    const movieResult = await fetchJson(`${movieServiceUrl}/movies/${movieId}`);
    if (!movieResult.ok) {
      return res.status(movieResult.status).json(movieResult.data);
    }

    const critiqueResult = await fetchJson(`${critiqueServiceUrl}/critiques/movie/${movieId}`);
    if (!critiqueResult.ok) {
      return res.status(critiqueResult.status).json(critiqueResult.data);
    }

    res.json({
      ...movieResult.data,
      critiques: critiqueResult.data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('API Gateway is running');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway running on port ${PORT}`);
});
