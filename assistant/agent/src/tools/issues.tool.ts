import { tool } from 'langchain';
import * as z from 'zod';

import { formatIssueFields, formatSearchResult } from '@/lib/fm.js';
import { jira } from '@/services/jiraClient.js';

export const searchIssues = tool(
  async ({ jql, maxResults, fields }) => {
    try {
      const response = await jira.issueSearch.searchForIssuesUsingJqlEnhancedSearch({
        jql,
        maxResults,
        fields,
      });

      if (!response.issues?.length) {
        return 'No issues found matching the query.';
      }

      const issues = response.issues.map(formatSearchResult);
      return JSON.stringify(issues, null, 2);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return `Error searching issues: ${message}`;
    }
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
    try {
      const issue = await jira.issues.getIssue({
        issueIdOrKey,
        fields,
      });

      const result = formatIssueFields(issue.fields);
      return JSON.stringify(result, null, 2);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return `Error getting issue: ${message}`;
    }
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
    try {
      const issue = await jira.issues.createIssue({
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
      });

      return { key: issue.key, link: `${process.env.JIRA_HOST}/browse/${issue.key}` };
    } catch (error: any) {
      return { error: error.message };
    }
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
    try {
      await jira.issues.editIssue({
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
      });
      return { success: true, key: args.issueKey };
    } catch (error: any) {
      return { error: error.message };
    }
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
    try {
      await jira.issues.assignIssue({
        issueIdOrKey: issueKey,
        // Use accountId: null to unassign
        accountId: accountId === 'unassigned' ? null : accountId,
      });
      return { success: true };
    } catch (error: any) {
      return { error: error.message };
    }
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
    try {
      await jira.issues.deleteIssue({
        issueIdOrKey: issueKey,
      });
      return { success: true, key: issueKey };
    } catch (error: any) {
      return { error: error.message };
    }
  },
  {
    name: 'issue_delete',
    description: 'Delete an issue.',
    schema: z.object({
      issueKey: z.string().describe('Key of the issue'),
    }),
  },
);
