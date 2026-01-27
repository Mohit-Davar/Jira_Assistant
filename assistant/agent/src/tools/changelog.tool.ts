import { tool } from 'langchain';
import * as z from 'zod';

import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';

export const getIssueChangelog = tool(
  async ({ issueKey, maxResults }) => {
    const [error, response] = await expectError(
      jira.issues.getChangeLogs({
        issueIdOrKey: issueKey,
        maxResults,
      }),
    );

    if (error) {
      return { error: error.message };
    }

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
