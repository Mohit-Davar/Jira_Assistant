import z from 'zod';

import { AvailableFields } from '@/agents/sub-agents/issue/types.js';
import { formatIssueFields } from '@/agents/sub-agents/issue/utils.js';
import { jira } from '@/agents/shared/lib/client.js';
import { tool } from '@openai/agents';

export const issueDetail = tool({
    name: 'get_issue',
    description: 'Get issue details',
    parameters: z.object({
        issueIdOrKey: z.string().describe('Issue key/ID'),
        fields: z.array(z.enum(AvailableFields)).describe('Fields to fetch'),
    }),

    async execute({ issueIdOrKey, fields }) {
        try {
            const issue = await jira.issues.getIssue({ issueIdOrKey, fields });
            return {
                key: issue.key,
                link: `${process.env.JIRA_HOST}/browse/${issue.key}`,
                ...formatIssueFields(issue.fields, fields),
            };
        } catch (error: unknown) {
            const response = {
                error: true,
                message: `Failed to fetch issue ${issueIdOrKey}`,
            }
            if (error instanceof Error)
                response.message = error.message;
            else
                response.message = "Unknown error occurred.";
            return response;
        }
    },
});
