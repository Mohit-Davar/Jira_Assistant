import z from 'zod';
import { jira } from '@/agents/shared/lib/client.js';
import { tool } from '@openai/agents';

export const issueDelete = tool({
    name: 'delete_issue',
    description: 'Deletes a Jira issue.',
    parameters: z.object({
        issueIdOrKey: z.string().describe('Issue ID or key.'),
        deleteSubtasks: z.boolean().default(true).describe('Delete subtasks?'),
    }),
    async execute({ issueIdOrKey, deleteSubtasks }) {
        try {
            await jira.issues.deleteIssue({
                issueIdOrKey,
                deleteSubtasks: deleteSubtasks
            });

            return {
                issueIdOrKey,
                message: `Issue ${issueIdOrKey} deleted successfully.`,
            };
        } catch (error: unknown) {
            const response = {
                error: true,
                message: `Failed to delete issue ${issueIdOrKey}`,
            }
            if (error instanceof Error)
                response.message = error.message;
            else
                response.message = "Unknown error occurred.";
            return response;
        }
    },
});
