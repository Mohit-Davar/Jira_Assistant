import { tool } from 'langchain';
import * as z from 'zod';

import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';

export const transitionIssue = tool(
  async ({ issueKey, statusName }) => {
    // Fetch valid transitions for this specific issue
    const [errorTransitions, { transitions }] = await expectError(
      jira.issues.getTransitions({ issueIdOrKey: issueKey }),
    );

    if (errorTransitions) {
      return { error: errorTransitions.message };
    }

    // Find a case-insensitive match
    const target = transitions?.find((t) => t.name?.toLowerCase() === statusName.toLowerCase());

    if (!target) {
      const available = transitions?.map((t) => t.name).join(', ');
      return { error: `Cannot move to '${statusName}'. Valid options: ${available}` };
    }

    // Execute the move
    const [errorDoTransition] = await expectError(
      jira.issues.doTransition({
        issueIdOrKey: issueKey,
        transition: { id: target.id },
      }),
    );

    if (errorDoTransition) {
      return { error: errorDoTransition.message };
    }

    return { success: true, currentStatus: target.name };
  },
  {
    name: 'transition_issue',
    description: 'Change the status of a Jira issue.',
    schema: z.object({
      issueKey: z.string().describe('The Jira issue key'),
      statusName: z.string().describe('The destination status name'),
    }),
  },
);

export const getTransitions = tool(
  async ({ issueKey }) => {
    const [error, { transitions }] = await expectError(
      jira.issues.getTransitions({ issueIdOrKey: issueKey }),
    );

    if (error) {
      return { error: error.message };
    }

    if (!transitions || transitions.length === 0) {
      return { message: 'No available transitions found for this issue.' };
    }

    // Return only the name and ID for clarity
    return {
      issueKey,
      availableStatuses: transitions.map((t) => ({
        name: t.name,
        id: t.id,
      })),
    };
  },
  {
    name: 'get_transitions',
    description: 'List available status transitions for a Jira issue.',
    schema: z.object({
      issueKey: z.string().describe('The Jira issue key'),
    }),
  },
);
