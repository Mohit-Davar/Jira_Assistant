import {
  searchIssuesConfig,
  getIssueConfig,
  createIssueConfig,
  updateIssueConfig,
  assignIssueConfig,
  deleteIssueConfig,
} from '@/tools/issues/types.js';
import {
  searchIssuesCallback,
  getIssueCallback,
  createIssueCallback,
  updateIssueCallback,
  assignIssueCallback,
  deleteIssueCallback,
} from '@/tools/issues/callbacks.js';

export const issueTools = [
  { name: 'search_issues', config: searchIssuesConfig, callback: searchIssuesCallback },
  { name: 'get_issue', config: getIssueConfig, callback: getIssueCallback },
  { name: 'create_issue', config: createIssueConfig, callback: createIssueCallback },
  { name: 'update_issue', config: updateIssueConfig, callback: updateIssueCallback },
  { name: 'assign_issue', config: assignIssueConfig, callback: assignIssueCallback },
  { name: 'delete_issue', config: deleteIssueConfig, callback: deleteIssueCallback },
];
