import z from 'zod';
import { jira } from '@/agents/shared/lib/client.js';
import { tool } from '@openai/agents';

export const issueCreate = tool({
    name: 'issue_create',
    description: 'Create a Jira issue.',
    parameters: z.object({
        projectKey: z.string().describe('Project key.'),
        summary: z.string().describe('Issue summary.'),
        issueType: z.string().describe('Type (e.g. Task, Bug, Story).'),
        description: z.string().default('').describe('Issue description.'),
        assigneeId: z.string().default('').describe('Assignee account ID.'),
        parentId: z.string().default('').describe('Parent key/ID for subtasks.'),
    }),
    async execute({ projectKey, summary, issueType, description, assigneeId, parentId }) {
        try {
            const issue = await jira.issues.createIssue({
                fields: {
                    project: { key: projectKey },
                    summary,
                    issuetype: { name: issueType },
                    description: description ? {
                        type: 'doc',
                        version: 1,
                        content: [
                            {
                                type: 'paragraph',
                                content: [{ type: 'text', text: description }]
                            }
                        ]
                    } : undefined,
                    assignee: assigneeId ? { accountId: assigneeId } : undefined,
                    parent: parentId ? { key: parentId } : undefined,
                }
            });

            return {
                id: issue.id,
                key: issue.key,
                self: issue.self,
                link: `${process.env.JIRA_HOST}/browse/${issue.key}`,
                message: `Issue ${issue.key} created successfully.`,
            };
        } catch (error: unknown) {
            const response = {
                error: true,
                message: `Failed to create issue`,
            }
            if (error instanceof Error)
                response.message = error.message;
            else
                response.message = "Unknown error occurred.";
            return response;
        }
    },
});
