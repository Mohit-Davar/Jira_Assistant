import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';
import { GetIssueChangelogInput } from '@/tools/changelog/types.js';

export async function getIssueChangelogCallback({ issueKey, maxResults }: GetIssueChangelogInput) {
  const [error, response] = await expectError(
    jira.issues.getChangeLogs({
      issueIdOrKey: issueKey,
      maxResults,
    }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const formattedChangelog = response.values?.map((history) => ({
    author: history.author?.displayName,
    created: history.created,
    changes: history.items?.map((item) => ({
      field: item.field,
      from: item.fromString,
      to: item.toString,
    })),
  }));

  const result = { issueKey, changelog: formattedChangelog };

  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}
