import * as z from 'zod';

export const addWorklogConfig = {
  description: 'Add a worklog (time tracking) to a Jira issue.',
  inputSchema: z.object({
    issueKey: z.string().describe('Issue key'),
    timeSpent: z.string().describe("Time spent, e.g., '1h 30m'"),
    started: z
      .string()
      .optional()
      .describe("ISO 8601 datetime when work started, e.g., '2023-10-27T10:00:00.000+0000'"),
    comment: z.string().optional().describe('Worklog comment'),
  }),
};
export type AddWorklogInput = z.infer<typeof addWorklogConfig.inputSchema>;

export const getWorklogsConfig = {
  description: 'Get all worklogs for a Jira issue.',
  inputSchema: z.object({
    issueKey: z.string().describe('Issue key'),
  }),
};
export type GetWorklogsInput = z.infer<typeof getWorklogsConfig.inputSchema>;

export const updateWorklogConfig = {
  description: 'Update an existing worklog on a Jira issue.',
  inputSchema: z.object({
    issueKey: z.string().describe('Issue key'),
    worklogId: z.string().describe('ID of the worklog. Use get_worklogs to get this.'),
    timeSpent: z.string().describe("Updated time spent, e.g., '2h'"),
    started: z.string().optional().describe('Updated start time (ISO 8601)'),
    comment: z.string().optional().describe('Updated worklog comment'),
  }),
};
export type UpdateWorklogInput = z.infer<typeof updateWorklogConfig.inputSchema>;

export const deleteWorklogConfig = {
  description: 'Delete a worklog from a Jira issue.',
  inputSchema: z.object({
    issueKey: z.string().describe('Issue key'),
    worklogId: z.string().describe('ID of the worklog to delete. Use get_worklogs to get this.'),
  }),
};
export type DeleteWorklogInput = z.infer<typeof deleteWorklogConfig.inputSchema>;
