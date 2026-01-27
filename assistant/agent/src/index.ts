import express from 'express';

import { chatController } from '@/controllers/chat.controller.js';

const app = express();
app.use(express.json());

app.post('/chat', chatController);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
