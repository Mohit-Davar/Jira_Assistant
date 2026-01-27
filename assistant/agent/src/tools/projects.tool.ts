import { tool } from 'langchain';
import * as z from 'zod';

import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';

export const listProjects = tool(
  async () => {
    const [error, response] = await expectError(
      jira.projects.searchProjects({
        maxResults: 50,
      }),
    );

    if (error) {
      return { error: error.message };
    }

    if (!response.values || response.values.length === 0) {
      return { error: 'No projects found.' };
    }

    return response.values.map((p) => ({
      id: p.id,
      key: p.key,
      name: p.name,
      type: p.projectTypeKey,
    }));
  },
  {
    name: 'list_projects',
    description: 'List all Jira projects the user can access.',
    schema: z.object({}),
  },
);

export const getProject = tool(
  async ({ projectKey }) => {
    const [error, project] = await expectError(
      jira.projects.getProject({ projectIdOrKey: projectKey }),
    );

    if (error) {
      return { error: error.message };
    }

    return {
      key: project.key,
      name: project.name,
      lead: project.lead?.displayName,
      description: project.description,
      issueTypes: project.issueTypes?.map((t) => t.name),
    };
  },
  {
    name: 'get_project',
    description: 'Get details of a Jira project by key.',
    schema: z.object({ projectKey: z.string() }),
  },
);
