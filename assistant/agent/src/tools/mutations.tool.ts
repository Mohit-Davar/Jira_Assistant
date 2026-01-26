import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { jira } from "@/services/jiraClient.js";

// Issue Creation Tool
export const createIssue = tool(
    async (args) => {
        try {
            const issue = await jira.issues.createIssue({
                fields: {
                    project: { key: args.projectKey },
                    summary: args.summary,
                    issuetype: { name: args.issueType },
                    description: args.description ? {
                        type: "doc", version: 1,
                        content: [{ type: "paragraph", content: [{ type: "text", text: args.description }] }],
                    } : undefined,
                    assignee: args.assigneeId ? { accountId: args.assigneeId } : undefined,
                    priority: args.priority ? { name: args.priority } : undefined,
                    labels: args.labels ?? [],
                    parent: args.parentId ? { key: args.parentId } : undefined,
                },
            });

            return { key: issue.key, link: `${process.env.JIRA_HOST}/browse/${issue.key}` };
        } catch (error: any) {
            return { error: error.message };
        }
    },
    {
        name: "issue_create",
        description: "Create a new Jira issue or sub-task.",
        schema: z.object({
            projectKey: z.string().describe("Project key"),
            summary: z.string().describe("Issue title"),
            issueType: z.string().describe("Type of issue (e.g., Task, Bug, Sub-task)"),
            description: z.string().optional().describe("Issue description"),
            assigneeId: z.string().optional().describe("User account ID"),
            priority: z.string().optional().describe("Priority level"),
            labels: z.array(z.string()).optional().describe("Tag list"),
            parentId: z.string().optional().describe("Parent key for subtasks"),
        }),
    }
);

// Issue Update Tool
export const updateIssue = tool(
    async (args) => {
        try {
            await jira.issues.editIssue({
                issueIdOrKey: args.issueKey,
                fields: {
                    ...(args.summary && { summary: args.summary }),
                    ...(args.description && {
                        description: {
                            type: "doc", version: 1,
                            content: [{ type: "paragraph", content: [{ type: "text", text: args.description }] }],
                        }
                    }),
                    ...(args.assigneeId && { assignee: { accountId: args.assigneeId } }),
                    ...(args.priority && { priority: { name: args.priority } }),
                    ...(args.labels && { labels: args.labels }),
                },
            });
            return { success: true, key: args.issueKey };
        } catch (error: any) {
            return { error: error.message };
        }
    },
    {
        name: "issue_update",
        description: "Update fields of an existing Jira issue.",
        schema: z.object({
            issueKey: z.string().describe("Issue key"),
            summary: z.string().optional().describe("New title"),
            description: z.string().optional().describe("New description"),
            assigneeId: z.string().optional().describe("New user ID"),
            priority: z.string().optional().describe("Priority level"),
            labels: z.array(z.string()).optional().describe("Replace all labels"),
        }),
    }
);