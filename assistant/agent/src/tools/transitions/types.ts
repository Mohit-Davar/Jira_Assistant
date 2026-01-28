import * as z from 'zod';

export const transitionIssueConfig = {
  description: 'Change the status of a Jira issue.',
  inputSchema: z.object({
    issueKey: z.string().describe('The Jira issue key'),
    statusName: z.string().describe('The destination status name'),
  }),
};
export type TransitionIssueInput = z.infer<typeof transitionIssueConfig.inputSchema>;

export const getTransitionsConfig = {
  description: 'List available status transitions for a Jira issue.',
  inputSchema: z.object({
    issueKey: z.string().describe('The Jira issue key'),
  }),
};
export type GetTransitionsInput = z.infer<typeof getTransitionsConfig.inputSchema>;
