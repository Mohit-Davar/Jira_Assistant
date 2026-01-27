import { tool } from 'langchain';
import * as z from 'zod';

import { jira } from '@/services/jiraClient.js';

export const listProjects = tool(
  async () => {
    try {
      const response = await jira.projects.searchProjects({
        maxResults: 50,
      });

      if (!response.values || response.values.length === 0) {
        return { error: 'No projects found.' };
      }

      return response.values.map((p) => ({
        id: p.id,
        key: p.key,
        name: p.name,
        type: p.projectTypeKey,
      }));
    } catch (e: any) {
      return { error: e.message };
    }
  },
  {
    name: 'list_projects',
    description: 'List all Jira projects the user can access.',
    schema: z.object({}),
  },
);

export const getProject = tool(
  async ({ projectKey }) => {
    try {
      const project = await jira.projects.getProject({ projectIdOrKey: projectKey });
      return {
        key: project.key,
        name: project.name,
        lead: project.lead?.displayName,
        description: project.description,
        issueTypes: project.issueTypes?.map((t) => t.name),
      };
    } catch (e: any) {
      return { error: e.message };
    }
  },
  {
    name: 'get_project',
    description: 'Get details of a Jira project by key.',
    schema: z.object({ projectKey: z.string() }),
  },
);
