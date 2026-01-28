import * as z from 'zod';

export const linkIssuesConfig = {
  description: 'Link two Jira issues together.',
  inputSchema: z.object({
    linkTypeName: z
      .string()
      .describe("The type of link (e.g., 'Blocks', 'Duplicates', 'Relates to')."),
    inwardIssueKey: z.string().describe('The key of the issue being linked to (destination).'),
    outwardIssueKey: z.string().describe('The key of the issue that initiates the link (source).'),
  }),
};
export type LinkIssuesInput = z.infer<typeof linkIssuesConfig.inputSchema>;

export const getIssueLinksConfig = {
  description: 'Get all links for a Jira issue.',
  inputSchema: z.object({
    issueKey: z.string().describe('Issue key'),
  }),
};
export type GetIssueLinksInput = z.infer<typeof getIssueLinksConfig.inputSchema>;

export const deleteIssueLinkConfig = {
  description: 'Delete a link between two issues.',
  inputSchema: z.object({
    linkId: z.string().describe('ID of the link to delete. Get this from `get_issue_links`.'),
  }),
};
export type DeleteIssueLinkInput = z.infer<typeof deleteIssueLinkConfig.inputSchema>;

export const getLinkTypesConfig = {
  description: 'Get all available issue link types in Jira.',
  inputSchema: z.object({}),
};
export type GetLinkTypesInput = z.infer<typeof getLinkTypesConfig.inputSchema>;
