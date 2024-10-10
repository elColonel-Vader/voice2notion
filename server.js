import express from 'express';
import { getNotionDatabases } from './src/api/getNotionDatabases.js';
import { sendToNotion } from './src/api/sendToNotion.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/api/getNotionDatabases', async (req, res) => {
  try {
    const databases = await getNotionDatabases();
    res.json(databases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Notion databases' });
  }
});

app.post('/api/sendToNotion', async (req, res) => {
  try {
    const result = await sendToNotion(req);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send note to Notion' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});