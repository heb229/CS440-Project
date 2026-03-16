// external imports
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// routes imports
import movieRoutes from './routes/movieRoutes.js';
import personRoutes from './routes/personRoutes.js';
import critiqueRoutes from './routes/critiqueRoutes.js';

// set app and port
const app = express();
const PORT = 3000;

// set nav names
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// note use of files and css
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// use routes
app.use('/', movieRoutes);
app.use('/people', personRoutes);
app.use('/critiques', critiqueRoutes);

// listen on our local port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});