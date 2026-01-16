import { instructions } from '@/agents/orchestrator/instructions.js';
import { issueAgent } from '@/agents/sub-agents/issue/agent.js';
import { inputGuardrail } from '@/agents/sub-agents/guardrail/input-guardrail/agent.js';
import { Agent } from '@openai/agents';

export const agent = new Agent({
    name: "Jira Assistant",
    instructions: instructions(),
    model: "gpt-5-nano",
    inputGuardrails: [inputGuardrail],
    tools: [
        issueAgent.asTool({
            toolName: "jira_issue",
            toolDescription: "Handles queries related to jira issues"
        })
    ]
});