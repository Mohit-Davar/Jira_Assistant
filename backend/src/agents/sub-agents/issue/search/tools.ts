import z from 'zod';

import { AvailableFields } from '../types.js';
import { formatIssueFields } from '../utils.js';
import { jira } from '@/agents/shared/lib/client.js';
import { tool } from '@openai/agents';

export const issueSearch = tool({
    name: 'issue_search',
    description: 'Search Jira issues with JQL.',
    parameters: z.object({
        jql: z.string().describe('JQL query.'),
        fields: z.array(z.enum(AvailableFields)).default(['summary', 'duedate', 'assignee', 'priority', 'status']).describe('Fields to return.'),
        maxResults: z.number().default(20).describe('Max results.'),
    }),
    async execute({ jql, fields, maxResults }) {
        try {
            const { issues = [] } = await jira.issueSearch.searchForIssuesUsingJqlEnhancedSearch({
                jql,
                fields,
                maxResults,
            });

            return {
                issues: issues.map((issue) => ({
                    key: issue.key,
                    link: `${process.env.JIRA_HOST}/browse/${issue.key}`,
                    ...formatIssueFields(issue.fields, fields),
                })),
            };
        } catch (error: unknown) {
            const response = {
                error: true,
                message: `Failed to search for issues`,
            }
            if (error instanceof Error)
                response.message = error.message;
            else
                response.message = "Unknown error occurred.";
            return response;
        }
    },
});
