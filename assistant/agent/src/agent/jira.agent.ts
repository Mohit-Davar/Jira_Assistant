import { createAgent } from 'langchain';

import { allTools } from '@/tools/index.js';

export function createJiraAgent() {
  return createAgent({
    model: 'gpt-5-nano',
    tools: allTools,
    systemPrompt: `
            You are a Jira Assistant.
            Respond naturally.
            Never invent data.
            If required info is missing, ask for it instead of calling a tool.
            Explain failures in user-friendly terms.
            Never show raw tool errors.
            Never suggest next questions.
        `,
  });
}
