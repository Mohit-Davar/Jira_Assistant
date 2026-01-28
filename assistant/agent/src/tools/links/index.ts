import {
  linkIssuesConfig,
  getIssueLinksConfig,
  deleteIssueLinkConfig,
  getLinkTypesConfig,
} from '@/tools/links/types.js';
import {
  linkIssuesCallback,
  getIssueLinksCallback,
  deleteIssueLinkCallback,
  getLinkTypesCallback,
} from '@/tools/links/callbacks.js';

export const linkTools = [
  { name: 'link_issues', config: linkIssuesConfig, callback: linkIssuesCallback },
  { name: 'get_issue_links', config: getIssueLinksConfig, callback: getIssueLinksCallback },
  { name: 'delete_issue_link', config: deleteIssueLinkConfig, callback: deleteIssueLinkCallback },
  { name: 'get_link_types', config: getLinkTypesConfig, callback: getLinkTypesCallback },
];
