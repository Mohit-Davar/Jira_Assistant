import { tool } from 'langchain';
import * as z from 'zod';

import { jira } from '@/services/jiraClient.js';

export const transitionIssue = tool(
  async ({ issueKey, statusName }) => {
    try {
      // Fetch valid transitions for this specific issue
      const { transitions } = await jira.issues.getTransitions({ issueIdOrKey: issueKey });

      // Find a case-insensitive match
      const target = transitions?.find((t) => t.name?.toLowerCase() === statusName.toLowerCase());

      if (!target) {
        const available = transitions?.map((t) => t.name).join(', ');
        return { error: `Cannot move to '${statusName}'. Valid options: ${available}` };
      }

      // Execute the move
      await jira.issues.doTransition({
        issueIdOrKey: issueKey,
        transition: { id: target.id },
      });

      return { success: true, currentStatus: target.name };
    } catch (e: any) {
      return { error: e.message };
    }
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
    try {
      const { transitions } = await jira.issues.getTransitions({ issueIdOrKey: issueKey });

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
    } catch (e: any) {
      return { error: e.message };
    }
  },
  {
    name: 'get_transitions',
    description: 'List available status transitions for a Jira issue.',
    schema: z.object({
      issueKey: z.string().describe('The Jira issue key'),
    }),
  },
);
