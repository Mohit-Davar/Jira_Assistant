import { tool } from 'langchain';
import * as z from 'zod';

import { formatIssueFields, formatSearchResult } from '@/lib/fm.js';
import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';

export const searchIssues = tool(
  async ({ jql, maxResults, fields }) => {
    const [error, response] = await expectError(
      jira.issueSearch.searchForIssuesUsingJqlEnhancedSearch({
        jql,
        maxResults,
        fields,
      }),
    );

    if (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return `Error searching issues: ${message}`;
    }

    if (!response.issues?.length) {
      return 'No issues found matching the query.';
    }

    const issues = response.issues.map(formatSearchResult);
    return JSON.stringify(issues, null, 2);
  },
  {
    name: 'issue_search',
    description: 'Search Jira issues using JQL.',
    schema: z.object({
      jql: z.string().describe('JQL query'),
      maxResults: z.number().default(20),
      fields: z
        .array(z.string())
        .default(['summary', 'duedate', 'assignee', 'priority', 'status', 'created'])
        .describe('Fields to fetch'),
    }),
  },
);

export const getIssue = tool(
  async ({ issueIdOrKey, fields }) => {
    const [error, issue] = await expectError(
      jira.issues.getIssue({
        issueIdOrKey,
        fields,
      }),
    );

    if (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return `Error getting issue: ${message}`;
    }

    const result = formatIssueFields(issue.fields);
    return JSON.stringify(result, null, 2);
  },
  {
    name: 'issue_search',
    description: 'Get details of a specific Jira issue.',
    schema: z.object({
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
  },
);

export const createIssue = tool(
  async (args) => {
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
      return { error: error.message };
    }

    return { key: issue.key, link: `${process.env.JIRA_HOST}/browse/${issue.key}` };
  },
  {
    name: 'issue_create',
    description: 'Create a new Jira issue or sub-task.',
    schema: z.object({
      projectKey: z.string().describe('Project key'),
      summary: z.string().describe('Issue title'),
      issueType: z.string().describe('Type of issue (e.g., Task, Bug, Sub-task)'),
      description: z.string().optional().describe('Issue description'),
      assigneeId: z.string().optional().describe('User account ID for assignment'),
      priority: z.string().optional().describe('Priority level'),
      labels: z.array(z.string()).optional().describe('Tag list'),
      parentId: z.string().optional().describe('Parent key for subtasks'),
    }),
  },
);

export const updateIssue = tool(
  async (args) => {
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
      return { error: error.message };
    }

    return { success: true, key: args.issueKey };
  },
  {
    name: 'issue_update',
    description: 'Update fields of an existing Jira issue.',
    schema: z.object({
      issueKey: z.string().describe('Issue key'),
      summary: z.string().optional().describe('New title'),
      description: z.string().optional().describe('New description'),
      priority: z.string().optional().describe('Priority level'),
      labels: z.array(z.string()).optional().describe('Replace all labels'),
    }),
  },
);

export const assignIssue = tool(
  async ({ issueKey, accountId }) => {
    const [error] = await expectError(
      jira.issues.assignIssue({
        issueIdOrKey: issueKey,
        // Use accountId: null to unassign
        accountId: accountId === 'unassigned' ? null : accountId,
      }),
    );

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  },
  {
    name: 'assign_issue',
    description: 'Assign an issue to a user or unassign it.',
    schema: z.object({
      issueKey: z.string().describe('Key of the issue to assign'),
      accountId: z
        .string()
        .describe(
          "Account ID of the user. Use `find_users` to get this. Set to 'unassigned' to unassign",
        ),
    }),
  },
);

export const deleteIssue = tool(
  async ({ issueKey }) => {
    const [error] = await expectError(
      jira.issues.deleteIssue({
        issueIdOrKey: issueKey,
      }),
    );

    if (error) {
      return { error: error.message };
    }

    return { success: true, key: issueKey };
  },
  {
    name: 'issue_delete',
    description: 'Delete an issue.',
    schema: z.object({
      issueKey: z.string().describe('Key of the issue'),
    }),
  },
);
