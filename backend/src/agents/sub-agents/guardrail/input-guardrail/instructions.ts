import { compose } from '@/agents/shared/utils/instructions.js';

export const instructions = () =>
    compose(
        `Only allow Jira queries like issues, comments, projects, users, actions etc.`,
        `Reject coding, creative, tutorial, or non-Jira requests even if Jira is mentioned.`,
    );

