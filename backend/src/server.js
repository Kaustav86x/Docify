import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import reposRoutes from './routes/repos';
import translateRoutes from './routes/translate';
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(bodyParser.json());
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${port}`);
});
export default app;
//# sourceMappingURL=server.js.map