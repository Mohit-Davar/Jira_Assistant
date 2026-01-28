import { getIssueChangelogConfig } from '@/tools/changelog/types.js';
import { getIssueChangelogCallback } from '@/tools/changelog/callbacks.js';

export const changelogTools = [
  {
    name: 'get_issue_changelog',
    config: getIssueChangelogConfig,
    callback: getIssueChangelogCallback,
  },
];
