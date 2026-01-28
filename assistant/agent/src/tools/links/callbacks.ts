import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';
import { LinkIssuesInput, GetIssueLinksInput, DeleteIssueLinkInput } from '@/tools/links/types.js';

export async function linkIssuesCallback({
  linkTypeName,
  inwardIssueKey,
  outwardIssueKey,
}: LinkIssuesInput) {
  const [error] = await expectError(
    jira.issueLinks.linkIssues({
      type: { name: linkTypeName },
      inwardIssue: { key: inwardIssueKey },
      outwardIssue: { key: outwardIssueKey },
    }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const result = { success: true };
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function getIssueLinksCallback({ issueKey }: GetIssueLinksInput) {
  const [error, issue] = await expectError(
    jira.issues.getIssue({
      issueIdOrKey: issueKey,
      fields: ['issuelinks'],
    }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const links = issue.fields.issuelinks?.map((link: any) => ({
    id: link.id,
    type: link.type.name,
    direction: link.inwardIssue ? 'inward' : 'outward',
    linkedIssueKey: (link.inwardIssue || link.outwardIssue).key,
    linkedIssueSummary: (link.inwardIssue || link.outwardIssue).fields.summary,
  }));

  const result = { issueKey, links };
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function deleteIssueLinkCallback({ linkId }: DeleteIssueLinkInput) {
  const [error] = await expectError(
    jira.issueLinks.deleteIssueLink({
      linkId,
    }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const result = { success: true };
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function getLinkTypesCallback() {
  const [error, response] = await expectError(jira.issueLinkTypes.getIssueLinkTypes());

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const result = response.issueLinkTypes?.map((t) => ({
    name: t.name,
    inward: t.inward,
    outward: t.outward,
  }));

  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}
