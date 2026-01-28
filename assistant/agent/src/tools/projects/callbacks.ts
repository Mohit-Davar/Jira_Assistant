import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';
import { GetProjectInput } from '@/tools/projects/types.js';

export async function listProjectsCallback() {
  const [error, response] = await expectError(
    jira.projects.searchProjects({
      maxResults: 50,
    }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  if (!response.values || response.values.length === 0) {
    return {
      content: [{ type: 'text' as const, text: 'No projects found.' }],
    };
  }

  const result = response.values.map((p) => ({
    id: p.id,
    key: p.key,
    name: p.name,
    type: p.projectTypeKey,
  }));

  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function getProjectCallback({ projectKey }: GetProjectInput) {
  const [error, project] = await expectError(
    jira.projects.getProject({ projectIdOrKey: projectKey }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const result = {
    key: project.key,
    name: project.name,
    lead: project.lead?.displayName,
    description: project.description,
    issueTypes: project.issueTypes?.map((t) => t.name),
  };

  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}
