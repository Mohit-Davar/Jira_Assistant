import { tool } from 'langchain';
import * as z from 'zod';

import { jira } from '@/services/jiraClient.js';

export const addWorklog = tool(
  async ({ issueKey, timeSpent, started, comment }) => {
    try {
      const response = await jira.issueWorklogs.addWorklog({
        issueIdOrKey: issueKey,
        timeSpent: timeSpent,
        started: started,
        comment: comment
          ? {
              type: 'doc',
              version: 1,
              content: [{ type: 'paragraph', content: [{ type: 'text', text: comment }] }],
            }
          : undefined,
      });
      return { success: true, worklogId: response.id };
    } catch (error: any) {
      return { error: error.message };
    }
  },
  {
    name: 'add_worklog',
    description: 'Add a worklog (time tracking) to a Jira issue.',
    schema: z.object({
      issueKey: z.string().describe('Issue key'),
      timeSpent: z.string().describe("Time spent, e.g., '1h 30m'"),
      started: z
        .string()
        .optional()
        .describe("ISO 8601 datetime when work started, e.g., '2023-10-27T10:00:00.000+0000'"),
      comment: z.string().optional().describe('Worklog comment'),
    }),
  },
);

export const getWorklogs = tool(
  async ({ issueKey }) => {
    try {
      const response = await jira.issueWorklogs.getIssueWorklog({
        issueIdOrKey: issueKey,
      });
      const worklogs = response.worklogs?.map((w) => ({
        id: w.id,
        author: w.author?.displayName,
        timeSpent: w.timeSpent,
        started: w.started,
        comment: w.comment?.content
          ?.map((p: any) => p.content?.map((t: any) => t.text).join(''))
          .join('\n'),
      }));
      return { issueKey, worklogs };
    } catch (error: any) {
      return { error: error.message };
    }
  },
  {
    name: 'get_worklogs',
    description: 'Get all worklogs for a Jira issue.',
    schema: z.object({
      issueKey: z.string().describe('Issue key'),
    }),
  },
);

export const updateWorklog = tool(
  async ({ issueKey, worklogId, timeSpent, started, comment }) => {
    try {
      await jira.issueWorklogs.updateWorklog({
        issueIdOrKey: issueKey,
        id: worklogId,
        timeSpent: timeSpent,
        started: started,
        comment: comment
          ? {
              type: 'doc',
              version: 1,
              content: [{ type: 'paragraph', content: [{ type: 'text', text: comment }] }],
            }
          : undefined,
      });
      return { success: true };
    } catch (error: any) {
      return { error: error.message };
    }
  },
  {
    name: 'update_worklog',
    description: 'Update an existing worklog on a Jira issue.',
    schema: z.object({
      issueKey: z.string().describe('Issue key'),
      worklogId: z.string().describe('ID of the worklog. Use get_worklogs to get this.'),
      timeSpent: z.string().describe("Updated time spent, e.g., '2h'"),
      started: z.string().optional().describe('Updated start time (ISO 8601)'),
      comment: z.string().optional().describe('Updated worklog comment'),
    }),
  },
);

export const deleteWorklog = tool(
  async ({ issueKey, worklogId }) => {
    try {
      await jira.issueWorklogs.deleteWorklog({
        issueIdOrKey: issueKey,
        id: worklogId,
      });
      return { success: true };
    } catch (error: any) {
      return { error: error.message };
    }
  },
  {
    name: 'delete_worklog',
    description: 'Delete a worklog from a Jira issue.',
    schema: z.object({
      issueKey: z.string().describe('Issue key'),
      worklogId: z.string().describe('ID of the worklog to delete. Use get_worklogs to get this.'),
    }),
  },
);
