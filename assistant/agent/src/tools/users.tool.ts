import { tool } from 'langchain';
import * as z from 'zod';

import { jira } from '@/services/jiraClient.js';

export const findUsers = tool(
  async ({ query, maxResults }) => {
    try {
      const users = await jira.userSearch.findUsers({
        query,
        maxResults,
      });
      return users.map((u) => ({
        accountId: u.accountId,
        displayName: u.displayName,
        emailAddress: u.emailAddress,
      }));
    } catch (error: any) {
      return { error: error.message };
    }
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
    try {
      const user = await jira.myself.getCurrentUser();
      return {
        accountId: user.accountId,
        displayName: user.displayName,
        email: user.emailAddress,
        timezone: user.timeZone,
      };
    } catch (e: any) {
      return { error: e.message };
    }
  },
  {
    name: 'get_current_user',
    description: 'Get the current Jira user.',
    schema: z.object({}),
  },
);
