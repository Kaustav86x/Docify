import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// import authRoutes from './routes/auth';
// import reposRoutes from './routes/repos';
// import translateRoutes from './routes/translate';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(bodyParser.json());

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/repos', reposRoutes);
// app.use('/api/translate', translateRoutes);

//Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Docify backend running' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;
