import * as z from 'zod';

export const searchIssuesConfig = {
  description: 'Search Jira issues using JQL.',
  inputSchema: z.object({
    jql: z.string().describe('JQL query'),
    maxResults: z.number().default(20),
    fields: z
      .array(z.string())
      .default(['summary', 'duedate', 'assignee', 'priority', 'status', 'created'])
      .describe('Fields to fetch'),
  }),
};
export type SearchIssuesInput = z.infer<typeof searchIssuesConfig.inputSchema>;

export const getIssueConfig = {
  description: 'Get details of a specific Jira issue.',
  inputSchema: z.object({
    issueIdOrKey: z.string().describe('Issue key or ID'),
    fields: z
      .array(z.string())
      .default([
        'summary',
        'description',
        'status',
        'assignee',
        'priority',
        'duedate',
        'created',
        'updated',
        'parent',
        'subtasks',
        'attachment',
      ])
      .describe('Fields to fetch'),
  }),
};
export type GetIssueInput = z.infer<typeof getIssueConfig.inputSchema>;

export const createIssueConfig = {
  description: 'Create a new Jira issue or sub-task.',
  inputSchema: z.object({
    projectKey: z.string().describe('Project key'),
    summary: z.string().describe('Issue title'),
    issueType: z.string().describe('Type of issue (e.g., Task, Bug, Sub-task)'),
    description: z.string().optional().describe('Issue description'),
    assigneeId: z.string().optional().describe('User account ID for assignment'),
    priority: z.string().optional().describe('Priority level'),
    labels: z.array(z.string()).optional().describe('Tag list'),
    parentId: z.string().optional().describe('Parent key for subtasks'),
  }),
};
export type CreateIssueInput = z.infer<typeof createIssueConfig.inputSchema>;

export const updateIssueConfig = {
  description: 'Update fields of an existing Jira issue.',
  inputSchema: z.object({
    issueKey: z.string().describe('Issue key'),
    summary: z.string().optional().describe('New title'),
    description: z.string().optional().describe('New description'),
    priority: z.string().optional().describe('Priority level'),
    labels: z.array(z.string()).optional().describe('Replace all labels'),
  }),
};
export type UpdateIssueInput = z.infer<typeof updateIssueConfig.inputSchema>;

export const assignIssueConfig = {
  description: 'Assign an issue to a user or unassign it.',
  inputSchema: z.object({
    issueKey: z.string().describe('Key of the issue to assign'),
    accountId: z
      .string()
      .describe(
        "Account ID of the user. Use `find_users` to get this. Set to 'unassigned' to unassign",
      ),
  }),
};
export type AssignIssueInput = z.infer<typeof assignIssueConfig.inputSchema>;

export const deleteIssueConfig = {
  description: 'Delete an issue.',
  inputSchema: z.object({
    issueKey: z.string().describe('Key of the issue'),
  }),
};
export type DeleteIssueInput = z.infer<typeof deleteIssueConfig.inputSchema>;
