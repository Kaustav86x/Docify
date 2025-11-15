import express, {} from 'express';
import { getUserRepos } from '../services/github.js';
const router = express.Router();
router.get('/', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const repos = await getUserRepos(token);
        res.json(repos);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch repos' });
    }
});
export default router;
//# sourceMappingURL=repos.js.map