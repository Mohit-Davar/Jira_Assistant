import 'dotenv/config';

import { Request, Response } from 'express';

import { expectError } from '@/lib/expectError.js';
import { createJiraAgent } from '@/services/jiraAgent.js';
import { allTools } from '@/tools/index.js';

export async function chatController(req: Request, res: Response) {
  const { query } = req.body;

  if (typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Invalid query format' });
  }

  const agent = createJiraAgent({
    model: 'gpt-5-nano',
    tools: allTools,
  });

  const [error, result] = await expectError(
    agent.invoke({
      messages: [{ role: 'user', content: query }],
    })
  );

  if (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: message
    });
  }

  const response = result.messages[result.messages.length - 1].content;

  return res.status(200).json({ response: response });
}
