import cors from 'cors';
import express from 'express';
import "dotenv/config";
import chatRouter from '@/routes/chat.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRouter);

const port = 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});