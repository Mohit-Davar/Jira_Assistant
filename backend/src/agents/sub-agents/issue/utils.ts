import { Fields } from 'jira.js/version3/models/fields';

import { generateResponseHandlers } from '@/agents/sub-agents/issue/handlers.js';
import { AvialableField } from '@/agents/sub-agents/issue/types.js';

export function formatIssueFields(
    fieldsRequested: Fields,
    availableFields: readonly AvialableField[]
): Record<string, any> {
    const response: Record<string, any> = {};

    for (const field of availableFields) {
        const handler = generateResponseHandlers[field];
        if (handler) {
            response[field] = handler(fieldsRequested);
        }
    }
    return response;
}
