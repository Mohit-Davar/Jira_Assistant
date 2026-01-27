import express from 'express';
import { chat } from '@/lib/queryController.js';
import { expectError } from '@/lib/expectError.js';

const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { query } = req.body;
  if (typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid query format' });
  }

  const [error, result] = await expectError(chat(query));
  if (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }

  return res.status(200).json({ response: result });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
