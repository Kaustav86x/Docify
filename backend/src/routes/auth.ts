import express, { type Request, type Response } from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/exchange', async (req: Request, res: Response) => {
  const { code } = req.body;

  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      { headers: { Accept: 'application/json' } }
    );

    res.json({ access_token: response.data.access_token });
  } catch (error) {
    res.status(500).json({ error: 'Auth exchange failed' });
  }
});

export default router;