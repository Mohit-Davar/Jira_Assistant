import { tool } from 'langchain';
import * as z from 'zod';

import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';

export const getAttachment = tool(
  async ({ attachmentId }) => {
    const [error, attachment] = await expectError(
      jira.issueAttachments.getAttachment({ id: attachmentId }),
    );

    if (error) {
      return { error: error.message };
    }

    return {
      filename: attachment.filename,
      author: attachment.author?.displayName,
      created: attachment.created,
      size: attachment.size,
      mimeType: attachment.mimeType,
      contentUrl: attachment.content,
    };
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
    const [error] = await expectError(jira.issueAttachments.removeAttachment({ id: attachmentId }));

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  },
  {
    name: 'delete_attachment',
    description: 'Delete an attachment from a Jira issue.',
    schema: z.object({
      attachmentId: z.string().describe('ID of the attachment. Get this from `get_issue`.'),
    }),
  },
);
