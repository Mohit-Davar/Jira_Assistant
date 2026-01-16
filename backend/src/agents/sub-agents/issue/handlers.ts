import { Fields } from 'jira.js/version3/models/fields';

export const generateResponseHandlers: Record<string, (fields: Fields) => any> = {
    // Simple field handlers
    summary: (fields) => fields.summary || null,
    description: (fields) => fields.description || null,
    status: (fields) => fields.status?.name || "Unknown",
    priority: (fields) => fields.priority?.name || null,
    duedate: (fields) => fields.duedate || null,
    created: (fields) => fields.created || null,
    updated: (fields) => fields.updated || null,

    // Complex field handlers
    assignee: (fields) => {
        const assignee = fields.assignee;
        return assignee ? {
            name: assignee.displayName,
            accountId: assignee.accountId,
            email: assignee.emailAddress || null,
        } : null;
    },
    parent: (fields) => {
        const parent = fields.parent;
        return parent ? {
            key: parent.key,
            summary: parent.fields?.summary || "No summary",
            status: parent.fields?.status?.name || "Unknown",
        } : null;
    },
    subtasks: (fields) => {
        const subtasks = fields.subtasks;
        return Array.isArray(subtasks)
            ? subtasks.map(subtask => ({
                key: subtask.key,
                summary: subtask.fields?.summary || "No summary",
                status: subtask.fields?.status?.name || "Unknown",
            }))
            : [];
    },
    attachment: (fields) => {
        const attachments = fields.attachment;
        return Array.isArray(attachments)
            ? attachments.map(attachment => ({
                id: attachment.id,
                name: attachment.filename,
                type: attachment.mimeType,
                size: attachment.size || null,
                url: attachment.content,
                thumbnail: attachment.thumbnail || null,
                created: attachment.created || null,
            }))
            : [];
    },
} as const;