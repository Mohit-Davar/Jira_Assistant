import { tool } from 'langchain';
import * as z from 'zod';

import { jira } from '@/services/jiraClient.js';

export const getIssueChangelog = tool(
  async ({ issueKey, maxResults }) => {
    try {
      const response = await jira.issues.getChangeLogs({
        issueIdOrKey: issueKey,
        maxResults,
      });

      const formattedChangelog = response.values?.map((history) => ({
        author: history.author?.displayName,
        created: history.created,
        changes: history.items?.map((item) => ({
          field: item.field,
          from: item.fromString,
          to: item.toString,
        })),
      }));

      return { issueKey, changelog: formattedChangelog };
    } catch (error: any) {
      return { error: error.message };
    }
  },
  {
    name: 'get_issue_changelog',
    description: 'Get the history of changes for a specific Jira issue.',
    schema: z.object({
      issueKey: z.string().describe('The Jira issue key.'),
      maxResults: z.number().default(20),
    }),
  },
);
