import * as z from 'zod';

export const getAttachmentConfig = {
  description: 'Get metadata for a specific attachment.',
  inputSchema: z.object({
    attachmentId: z.string().describe('ID of the attachment. Get this from `get_issue`.'),
  }),
};
export type GetAttachmentInput = z.infer<typeof getAttachmentConfig.inputSchema>;

export const deleteAttachmentConfig = {
  description: 'Delete an attachment from a Jira issue.',
  inputSchema: z.object({
    attachmentId: z.string().describe('ID of the attachment. Get this from `get_issue`.'),
  }),
};
export type DeleteAttachmentInput = z.infer<typeof deleteAttachmentConfig.inputSchema>;
