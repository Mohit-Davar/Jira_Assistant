import { tool } from 'langchain';
import * as z from 'zod';

import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';

export const addWorklog = tool(
  async ({ issueKey, timeSpent, started, comment }) => {
    const [error, response] = await expectError(
      jira.issueWorklogs.addWorklog({
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
      }),
    );

    if (error) {
      return { error: error.message };
    }

    return { success: true, worklogId: response.id };
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
    const [error, response] = await expectError(
      jira.issueWorklogs.getIssueWorklog({
        issueIdOrKey: issueKey,
      }),
    );

    if (error) {
      return { error: error.message };
    }

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
    const [error] = await expectError(
      jira.issueWorklogs.updateWorklog({
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
      }),
    );

    if (error) {
      return { error: error.message };
    }

    return { success: true };
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
    const [error] = await expectError(
      jira.issueWorklogs.deleteWorklog({
        issueIdOrKey: issueKey,
        id: worklogId,
      }),
    );

    if (error) {
      return { error: error.message };
    }

    return { success: true };
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
