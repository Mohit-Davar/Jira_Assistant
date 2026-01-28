import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';
import { FindUsersInput } from '@/tools/users/types.js';

export async function findUsersCallback({ query, maxResults }: FindUsersInput) {
  const [error, users] = await expectError(
    jira.userSearch.findUsers({
      query,
      maxResults,
    }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const result = users.map((u: any) => ({
    accountId: u.accountId,
    displayName: u.displayName,
    emailAddress: u.emailAddress,
  }));

  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function getCurrentUserCallback() {
  const [error, user] = await expectError(jira.myself.getCurrentUser());

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const result = {
    accountId: user.accountId,
    displayName: user.displayName,
    email: user.emailAddress,
    timezone: user.timeZone,
  };

  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}
