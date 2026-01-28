import * as z from 'zod';

export const getIssueChangelogConfig = {
  description: 'Get the history of changes for a specific Jira issue.',
  inputSchema: z.object({
    issueKey: z.string().describe('The Jira issue key.'),
    maxResults: z.number().default(20),
  }),
};
export type GetIssueChangelogInput = z.infer<typeof getIssueChangelogConfig.inputSchema>;
