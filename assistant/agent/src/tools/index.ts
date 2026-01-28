import { attachmentTools } from '@/tools/attachments/index.js';
import { changelogTools } from '@/tools/changelog/index.js';
import { commentTools } from '@/tools/comments/index.js';
import { issueTools } from '@/tools/issues/index.js';
import { linkTools } from '@/tools/links/index.js';
import { projectTools } from '@/tools/projects/index.js';
import { transitionTools } from '@/tools/transitions/index.js';
import { userTools } from '@/tools/users/index.js';
import { worklogTools } from '@/tools/worklogs/index.js';

export const allTools = [
  ...attachmentTools,
  ...changelogTools,
  ...commentTools,
  ...issueTools,
  ...linkTools,
  ...projectTools,
  ...transitionTools,
  ...userTools,
  ...worklogTools,
];
