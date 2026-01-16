import { Router } from 'express';
import { handleChatQuery } from '@/controllers/chat.controller.js';

const router = Router();

router.post("/query", handleChatQuery);

export default router;
