import {
    compose, CORE_GUARDRAILS, TOOL_USAGE_RULES,
} from '@/agents/shared/utils/instructions.js';

export interface IssueAgentContext {
    projectKey?: string;
}
export const instructions = (context: IssueAgentContext = {}) => {
    return compose(
        `Handle Jira issue requests only.`,
        `Respond with only asked information.`,
        TOOL_USAGE_RULES,
        CORE_GUARDRAILS,
        context.projectKey && `Default project key is ${context.projectKey}.`
    );
};
