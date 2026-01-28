import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';
import { TransitionIssueInput, GetTransitionsInput } from '@/tools/transitions/types.js';

export async function transitionIssueCallback({ issueKey, statusName }: TransitionIssueInput) {
  const [errorTransitions, responseTransitions] = await expectError(
    jira.issues.getTransitions({ issueIdOrKey: issueKey }),
  );

  if (errorTransitions) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${errorTransitions.message}` }],
      isError: true,
    };
  }

  const transitions = responseTransitions.transitions;
  const target = transitions?.find((t: any) => t.name?.toLowerCase() === statusName.toLowerCase());

  if (!target) {
    const available = transitions?.map((t: any) => t.name).join(', ');
    return {
      content: [
        {
          type: 'text' as const,
          text: `Cannot move to '${statusName}'. Valid options: ${available}`,
        },
      ],
      isError: true,
    };
  }

  const [errorDoTransition] = await expectError(
    jira.issues.doTransition({
      issueIdOrKey: issueKey,
      transition: { id: target.id },
    }),
  );

  if (errorDoTransition) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${errorDoTransition.message}` }],
      isError: true,
    };
  }

  const result = { success: true, currentStatus: target.name };
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function getTransitionsCallback({ issueKey }: GetTransitionsInput) {
  const [error, response] = await expectError(
    jira.issues.getTransitions({ issueIdOrKey: issueKey }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const transitions = response.transitions;
  if (!transitions || transitions.length === 0) {
    return {
      content: [{ type: 'text' as const, text: 'No available transitions found for this issue.' }],
    };
  }

  const result = {
    issueKey,
    availableStatuses: transitions.map((t: any) => ({
      name: t.name,
      id: t.id,
    })),
  };

  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}
