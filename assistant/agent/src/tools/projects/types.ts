import * as z from 'zod';

export const listProjectsConfig = {
  description: 'List all Jira projects the user can access.',
  inputSchema: z.object({}),
};
export type ListProjectsInput = z.infer<typeof listProjectsConfig.inputSchema>;

export const getProjectConfig = {
  description: 'Get details of a Jira project by key.',
  inputSchema: z.object({ projectKey: z.string() }),
};
export type GetProjectInput = z.infer<typeof getProjectConfig.inputSchema>;
