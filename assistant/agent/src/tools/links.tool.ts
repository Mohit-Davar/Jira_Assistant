import { tool } from 'langchain';
import * as z from 'zod';

import { jira } from '@/services/jiraClient.js';

export const linkIssues = tool(
  async ({ linkTypeName, inwardIssueKey, outwardIssueKey }) => {
    try {
      await jira.issueLinks.linkIssues({
        type: { name: linkTypeName },
        inwardIssue: { key: inwardIssueKey },
        outwardIssue: { key: outwardIssueKey },
      });
      return { success: true };
    } catch (error: any) {
      return { error: error.message };
    }
  },
  {
    name: 'link_issues',
    description: 'Link two Jira issues together.',
    schema: z.object({
      linkTypeName: z
        .string()
        .describe("The type of link (e.g., 'Blocks', 'Duplicates', 'Relates to')."),
      inwardIssueKey: z.string().describe('The key of the issue being linked to (destination).'),
      outwardIssueKey: z
        .string()
        .describe('The key of the issue that initiates the link (source).'),
    }),
  },
);

export const getIssueLinks = tool(
  async ({ issueKey }) => {
    try {
      const issue = await jira.issues.getIssue({
        issueIdOrKey: issueKey,
        fields: ['issuelinks'],
      });

      const links = issue.fields.issuelinks?.map((link: any) => ({
        id: link.id,
        type: link.type.name,
        direction: link.inwardIssue ? 'inward' : 'outward',
        linkedIssueKey: (link.inwardIssue || link.outwardIssue).key,
        linkedIssueSummary: (link.inwardIssue || link.outwardIssue).fields.summary,
      }));

      return { issueKey, links };
    } catch (error: any) {
      return { error: error.message };
    }
  },
  {
    name: 'get_issue_links',
    description: 'Get all links for a Jira issue.',
    schema: z.object({
      issueKey: z.string().describe('Issue key'),
    }),
  },
);

export const deleteIssueLink = tool(
  async ({ linkId }) => {
    try {
      await jira.issueLinks.deleteIssueLink({
        linkId,
      });
      return { success: true };
    } catch (error: any) {
      return { error: error.message };
    }
  },
  {
    name: 'delete_issue_link',
    description: 'Delete a link between two issues.',
    schema: z.object({
      linkId: z.string().describe('ID of the link to delete. Get this from `get_issue_links`.'),
    }),
  },
);

export const getLinkTypes = tool(
  async () => {
    try {
      const response = await jira.issueLinkTypes.getIssueLinkTypes();
      return response.issueLinkTypes?.map((t) => ({
        name: t.name,
        inward: t.inward,
        outward: t.outward,
      }));
    } catch (error: any) {
      return { error: error.message };
    }
  },
  {
    name: 'get_link_types',
    description: 'Get all available issue link types in Jira.',
    schema: z.object({}),
  },
);
