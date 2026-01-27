import { tool } from 'langchain';
import * as z from 'zod';

import { jira } from '@/services/jiraClient.js';

export const getAttachment = tool(
  async ({ attachmentId }) => {
    try {
      const attachment = await jira.issueAttachments.getAttachment({ id: attachmentId });
      return {
        filename: attachment.filename,
        author: attachment.author?.displayName,
        created: attachment.created,
        size: attachment.size,
        mimeType: attachment.mimeType,
        contentUrl: attachment.content,
      };
    } catch (error: any) {
      return { error: error.message };
    }
  },
  {
    name: 'get_attachment_details',
    description: 'Get metadata for a specific attachment.',
    schema: z.object({
      attachmentId: z.string().describe('ID of the attachment. Get this from `get_issue`.'),
    }),
  },
);

export const deleteAttachment = tool(
  async ({ attachmentId }) => {
    try {
      await jira.issueAttachments.removeAttachment({ id: attachmentId });
      return { success: true };
    } catch (error: any) {
      return { error: error.message };
    }
  },
  {
    name: 'delete_attachment',
    description: 'Delete an attachment from a Jira issue.',
    schema: z.object({
      attachmentId: z.string().describe('ID of the attachment. Get this from `get_issue`.'),
    }),
  },
);
