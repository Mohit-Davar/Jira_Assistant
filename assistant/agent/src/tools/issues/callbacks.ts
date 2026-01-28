import { formatIssueFields, formatSearchResult } from '@/lib/fm.js';
import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';
import {
  SearchIssuesInput,
  GetIssueInput,
  CreateIssueInput,
  UpdateIssueInput,
  AssignIssueInput,
  DeleteIssueInput,
} from '@/tools/issues/types.js';

export async function searchIssuesCallback({ jql, maxResults, fields }: SearchIssuesInput) {
  const [error, response] = await expectError(
    jira.issueSearch.searchForIssuesUsingJqlEnhancedSearch({
      jql,
      maxResults,
      fields,
    }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error searching issues: ${error.message}` }],
      isError: true,
    };
  }

  if (!response.issues?.length) {
    return {
      content: [{ type: 'text' as const, text: 'No issues found matching the query.' }],
    };
  }

  const issues = response.issues.map(formatSearchResult);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(issues, null, 2) }],
  };
}

export async function getIssueCallback({ issueIdOrKey, fields }: GetIssueInput) {
  const [error, issue] = await expectError(
    jira.issues.getIssue({
      issueIdOrKey,
      fields,
    }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error getting issue: ${error.message}` }],
      isError: true,
    };
  }

  const result = formatIssueFields(issue.fields);
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function createIssueCallback(args: CreateIssueInput) {
  const [error, issue] = await expectError(
    jira.issues.createIssue({
      fields: {
        project: { key: args.projectKey },
        summary: args.summary,
        issuetype: { name: args.issueType },
        description: args.description
          ? {
              type: 'doc',
              version: 1,
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: args.description }],
                },
              ],
            }
          : undefined,
        assignee: args.assigneeId ? { accountId: args.assigneeId } : undefined,
        priority: args.priority ? { name: args.priority } : undefined,
        labels: args.labels ?? [],
        parent: args.parentId ? { key: args.parentId } : undefined,
      },
    }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const result = { key: issue.key, link: `${process.env.JIRA_HOST}/browse/${issue.key}` };
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function updateIssueCallback(args: UpdateIssueInput) {
  const [error] = await expectError(
    jira.issues.editIssue({
      issueIdOrKey: args.issueKey,
      fields: {
        ...(args.summary && { summary: args.summary }),
        ...(args.description && {
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: args.description }],
              },
            ],
          },
        }),
        ...(args.priority && { priority: { name: args.priority } }),
        ...(args.labels && { labels: args.labels }),
      },
    }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const result = { success: true, key: args.issueKey };
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function assignIssueCallback({ issueKey, accountId }: AssignIssueInput) {
  const [error] = await expectError(
    jira.issues.assignIssue({
      issueIdOrKey: issueKey,
      accountId: accountId === 'unassigned' ? null : accountId,
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

export async function deleteIssueCallback({ issueKey }: DeleteIssueInput) {
  const [error] = await expectError(
    jira.issues.deleteIssue({
      issueIdOrKey: issueKey,
    }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const result = { success: true, key: issueKey };
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}
