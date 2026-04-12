// Imports
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = 3000;

// services
const SERVICES = {
  movies: 'http://movie-service:3001',
  people: 'http://person-service:3002',
  critiques: 'http://critique-service:3003'
};

// middleware
app.use(cors());

app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

// Helper function to fetch JSON data from a service
async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data
  };
}

// The details route hides cross-service orchestration from the frontend.
app.get('/movies/:id/details', async (req, res) => {
  // 1. Get movie details from the movie service
  // 2. Get critiques for the movie from the critique service
  // 3. Combine the data and return it to the client
  try {
    const movieId = req.params.id;

    // Fetch movie details
    const movieResult = await fetchJson(`${SERVICES.movies}/movies/${movieId}`);
    if (!movieResult.ok) {
      return res.status(movieResult.status).json(movieResult.data);
    }

    // Fetch critiques for the movie
    const critiqueResult = await fetchJson(`${SERVICES.critiques}/movies/${movieId}/critiques`);
    if (!critiqueResult.ok) {
      return res.status(critiqueResult.status).json(critiqueResult.data);
    }

    // Combine movie details with critiques and return
    return res.json({
      ...movieResult.data,
      critiques: critiqueResult.data
    });
  } 
  // If any service call fails, return an error response
  catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Proxy routes for other services
  // All other routes are proxied to their respective services
app.use('/movies', createProxyMiddleware({ target: SERVICES.movies, changeOrigin: true }));
app.use('/people', createProxyMiddleware({ target: SERVICES.people, changeOrigin: true }));
app.use('/critiques', createProxyMiddleware({ target: SERVICES.critiques, changeOrigin: true }));

// Health check route to verify the gateway is running
app.get('/', (req, res) => {
  res.send('API Gateway is running');
});

// Start the server on port 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway running on port ${PORT}`);
});
