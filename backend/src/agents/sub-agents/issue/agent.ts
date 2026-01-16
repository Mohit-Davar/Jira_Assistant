import { issueCreate } from '@/agents/sub-agents/issue/create/tools.js';
import { issueDelete } from '@/agents/sub-agents/issue/delete/tools.js';
import { issueDetail } from '@/agents/sub-agents/issue/details/tools.js';
import { instructions } from '@/agents/sub-agents/issue/instructions.js';
import { issueSearch } from '@/agents/sub-agents/issue/search/tools.js';
import { Agent } from '@openai/agents';

export const issueAgent = new Agent({
    name: "Issue Agent",
    instructions: instructions(),
    model: "gpt-5-nano",
    tools: [issueDetail, issueSearch, issueCreate, issueDelete],
});
