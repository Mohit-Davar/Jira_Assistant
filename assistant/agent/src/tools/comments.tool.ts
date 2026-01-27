import { tool } from 'langchain';
import * as z from 'zod';

import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';

export const addComment = tool(
  async ({ issueKey, comment }) => {
    const [error, response] = await expectError(
      jira.issueComments.addComment({
        issueIdOrKey: issueKey,
        comment: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: comment }],
            },
          ],
        },
      }),
    );

    if (error) {
      return { error: error.message };
    }

    return { success: true, commentId: response.id };
  },
  {
    name: 'add_comment',
    description: 'Add a comment to a Jira issue.',
    schema: z.object({
      issueKey: z.string().describe('Issue key'),
      comment: z.string().describe('Comment text'),
    }),
  },
);

export const getComments = tool(
  async ({ issueKey }) => {
    const [error, response] = await expectError(
      jira.issueComments.getComments({
        issueIdOrKey: issueKey,
      }),
    );

    if (error) {
      return { error: error.message };
    }

    // Map complex ADF content to simple strings for agent readability
    const comments = response.comments?.map((c) => ({
      id: c.id,
      author: c.author?.displayName,
      created: c.created,
      body: c.body?.content
        ?.map((p: any) => p.content?.map((t: any) => t.text).join(''))
        .join('\n'),
    }));

    return { issueKey, comments };
  },
  {
    name: 'get_comments',
    description: 'Get all comments from a Jira issue.',
    schema: z.object({
      issueKey: z.string().describe('Issue key'),
    }),
  },
);

export const updateComment = tool(
  async ({ issueKey, commentId, comment }) => {
    const [error] = await expectError(
      jira.issueComments.updateComment({
        issueIdOrKey: issueKey,
        id: commentId,
        body: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: comment }],
            },
          ],
        },
      }),
    );

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  },
  {
    name: 'update_comment',
    description: 'Update an existing comment on a Jira issue.',
    schema: z.object({
      issueKey: z.string().describe('Issue key'),
      commentId: z.string().describe('ID of the comment. Use get_comments to get this.'),
      comment: z.string().describe('New comment text'),
    }),
  },
);

export const deleteComment = tool(
  async ({ issueKey, commentId }) => {
    const [error] = await expectError(
      jira.issueComments.deleteComment({
        issueIdOrKey: issueKey,
        id: commentId,
      }),
    );

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  },
  {
    name: 'delete_comment',
    description: 'Delete a comment from a Jira issue.',
    schema: z.object({
      issueKey: z.string().describe('Issue key'),
      commentId: z.string().describe('ID of the comment. Use get_comments to get this.'),
    }),
  },
);
