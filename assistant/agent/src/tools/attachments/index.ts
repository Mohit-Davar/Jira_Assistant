import { getAttachmentConfig, deleteAttachmentConfig } from '@/tools/attachments/types.js';
import { getAttachmentCallback, deleteAttachmentCallback } from '@/tools/attachments/callbacks.js';

export const attachmentTools = [
  { name: 'get_attachment_details', config: getAttachmentConfig, callback: getAttachmentCallback },
  { name: 'delete_attachment', config: deleteAttachmentConfig, callback: deleteAttachmentCallback },
];
