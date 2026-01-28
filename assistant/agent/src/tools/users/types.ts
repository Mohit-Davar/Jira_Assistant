import * as z from 'zod';

export const findUsersConfig = {
  description: 'Find Jira users by name or email.',
  inputSchema: z.object({
    query: z.string().describe('Search query for user'),
    maxResults: z.number().default(20),
  }),
};
export type FindUsersInput = z.infer<typeof findUsersConfig.inputSchema>;

export const getCurrentUserConfig = {
  description: 'Get the current Jira user.',
  inputSchema: z.object({}),
};
export type GetCurrentUserInput = z.infer<typeof getCurrentUserConfig.inputSchema>;
