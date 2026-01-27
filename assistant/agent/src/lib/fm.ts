import type { Fields } from 'jira.js/version3/models/fields';

export function formatIssueFields(fields: Fields) {
  return {
    key: fields.key,
    summary: fields.summary || null,
    description: fields.description || null,
    status: fields.status?.name || 'Unknown',
    priority: fields.priority?.name || null,
    duedate: fields.duedate || null,
    created: fields.created || null,
    updated: fields.updated || null,
    assignee: fields.assignee?.displayName || 'Unassigned',
    parent: fields.parent
      ? {
          key: fields.parent.key,
          summary: fields.parent.fields?.summary || 'No summary',
        }
      : null,
    subtasks: Array.isArray(fields.subtasks)
      ? fields.subtasks.map((subtask) => ({
          key: subtask.key,
          summary: subtask.fields?.summary || 'No summary',
        }))
      : [],
    attachments: Array.isArray(fields.attachment)
      ? fields.attachment.map((attachment) => ({
          name: attachment.filename,
          url: attachment.content,
        }))
      : [],
  };
}

export function formatSearchResult(issue: any) {
  return {
    key: issue.key,
    summary: issue.fields.summary || null,
    status: issue.fields.status?.name || 'Unknown',
    assignee: issue.fields.assignee?.displayName || 'Unassigned',
    priority: issue.fields.priority?.name || 'Unknown',
    duedate: issue.fields.duedate || null,
    created: issue.fields.created || null,
  };
}
