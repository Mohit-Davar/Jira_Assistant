import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';
import {
  AddWorklogInput,
  GetWorklogsInput,
  UpdateWorklogInput,
  DeleteWorklogInput,
} from './types.js';

export async function addWorklogCallback({
  issueKey,
  timeSpent,
  started,
  comment,
}: AddWorklogInput) {
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
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const result = { success: true, worklogId: response.id };
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function getWorklogsCallback({ issueKey }: GetWorklogsInput) {
  const [error, response] = await expectError(
    jira.issueWorklogs.getIssueWorklog({
      issueIdOrKey: issueKey,
    }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const worklogs = response.worklogs?.map((w: any) => ({
    id: w.id,
    author: w.author?.displayName,
    timeSpent: w.timeSpent,
    started: w.started,
    comment: w.comment?.content
      ?.map((p: any) => p.content?.map((t: any) => t.text).join(''))
      .join('\n'),
  }));

  const result = { issueKey, worklogs };
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function updateWorklogCallback({
  issueKey,
  worklogId,
  timeSpent,
  started,
  comment,
}: UpdateWorklogInput) {
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

export async function deleteWorklogCallback({ issueKey, worklogId }: DeleteWorklogInput) {
  const [error] = await expectError(
    jira.issueWorklogs.deleteWorklog({
      issueIdOrKey: issueKey,
      id: worklogId,
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
