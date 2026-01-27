import { createAgent, type Tool } from 'langchain';

interface AgentConfig {
  tools: any[];
  model: string;
}

export function createJiraAgent({ tools, model }: AgentConfig) {
  return createAgent({
    model,
    tools,
    systemPrompt: `
    You are a Jira Assistant. 
    Guidelines:
    - Respond naturally; do not suggest follow-up questions.
    - No fabrications. If data is missing, ask the user.
    - Hide raw tool errors; provide user-friendly explanations.
    - Perform multi-step actions: use search tools to find IDs (Project, User, Transition, Issue).
    - Only call tools when all required parameters are identified.`,
  });
}
