import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';
import {
  AddCommentInput,
  GetCommentsInput,
  UpdateCommentInput,
  DeleteCommentInput,
} from './types.js';

export async function addCommentCallback({ issueKey, comment }: AddCommentInput) {
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
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const result = { success: true, commentId: response.id };
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function getCommentsCallback({ issueKey }: GetCommentsInput) {
  const [error, response] = await expectError(
    jira.issueComments.getComments({
      issueIdOrKey: issueKey,
    }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const comments = response.comments?.map((c) => ({
    id: c.id,
    author: c.author?.displayName,
    created: c.created,
    body: c.body?.content?.map((p: any) => p.content?.map((t: any) => t.text).join('')).join('\n'),
  }));

  const result = { issueKey, comments };
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function updateCommentCallback({ issueKey, commentId, comment }: UpdateCommentInput) {
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
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const result = { success: true };
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function deleteCommentCallback({ issueKey, commentId }: DeleteCommentInput) {
  const [error] = await expectError(
    jira.issueComments.deleteComment({
      issueIdOrKey: issueKey,
      id: commentId,
    }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const result = { success: true };
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}
