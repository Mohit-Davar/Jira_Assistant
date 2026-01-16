export const AvailableFields = [
    "summary",
    "description",
    "status",
    "assignee",
    "priority",
    "duedate",
    "created",
    "updated",
    "parent",
    "subtasks",
    "attachment",
] as const;
export type AvialableField = typeof AvailableFields[number];