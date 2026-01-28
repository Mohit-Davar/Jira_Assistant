import { jira } from '@/services/jiraClient.js';
import { expectError } from '@/lib/expectError.js';
import { GetAttachmentInput, DeleteAttachmentInput } from '@/tools/attachments/types.js';

export async function getAttachmentCallback({ attachmentId }: GetAttachmentInput) {
  const [error, attachment] = await expectError(
    jira.issueAttachments.getAttachment({ id: attachmentId }),
  );

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  const result = {
    filename: attachment.filename,
    author: attachment.author?.displayName,
    created: attachment.created,
    size: attachment.size,
    mimeType: attachment.mimeType,
    contentUrl: attachment.content,
  };

  return {
    content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
  };
}

export async function deleteAttachmentCallback({ attachmentId }: DeleteAttachmentInput) {
  const [error] = await expectError(jira.issueAttachments.removeAttachment({ id: attachmentId }));

  if (error) {
    return {
      content: [{ type: 'text' as const, text: `Error: ${error.message}` }],
      isError: true,
    };
  }

  return {
    content: [{ type: 'text' as const, text: JSON.stringify({ success: true }, null, 2) }],
  };
}
