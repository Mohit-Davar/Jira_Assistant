import { tool } from 'langchain';
import * as z from 'zod';

import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';

export const findUsers = tool(
  async ({ query, maxResults }) => {
    const [error, users] = await expectError(
      jira.userSearch.findUsers({
        query,
        maxResults,
      }),
    );

    if (error) {
      return { error: error.message };
    }

    return users.map((u) => ({
      accountId: u.accountId,
      displayName: u.displayName,
      emailAddress: u.emailAddress,
    }));
  },
  {
    name: 'find_users',
    description: 'Find Jira users by name or email.',
    schema: z.object({
      query: z.string().describe('Search query for user'),
      maxResults: z.number().default(20),
    }),
  },
);

export const getCurrentUser = tool(
  async () => {
    const [error, user] = await expectError(jira.myself.getCurrentUser());

    if (error) {
      return { error: error.message };
    }

    return {
      accountId: user.accountId,
      displayName: user.displayName,
      email: user.emailAddress,
      timezone: user.timeZone,
    };
  },
  {
    name: 'get_current_user',
    description: 'Get the current Jira user.',
    schema: z.object({}),
  },
);
