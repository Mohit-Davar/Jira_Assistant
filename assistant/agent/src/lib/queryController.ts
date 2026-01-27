import 'dotenv/config';
import { createJiraAgent } from '@/agent/jira.agent.js';
import { allTools } from '@/tools/index.js';
import { expectError } from '@/lib/expectError.js';

export async function chat(query: string): Promise<string> {
  const agent = createJiraAgent({
    tools: allTools,
    model: 'gpt-5-nano',
  });

  const [error, result] = await expectError(
    agent.invoke({
      messages: [{ role: 'user', content: query }],
    }),
  );
  if (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Agent invocation failed: ${message}`);
  }

  return result.messages[result.messages.length - 1].content as string;
}
