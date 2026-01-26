import { tool } from "langchain";
import * as z from "zod";
import { jira } from "@/services/jiraClient.js";

export const addComment = tool(
    async ({ issueKey, comment }) => {
        try {
            const response = await jira.issueComments.addComment({
                issueIdOrKey: issueKey,
                comment: {
                    type: "doc",
                    version: 1,
                    content: [
                        {
                            type: "paragraph",
                            content: [{ type: "text", text: comment }],
                        },
                    ],
                },
            });

            return { success: true, commentId: response.id };
        } catch (error: any) {
            return { error: error.message };
        }
    },
    {
        name: "add_comment",
        description: "Add a comment to a Jira issue.",
        schema: z.object({
            issueKey: z.string().describe("Issue key"),
            comment: z.string().describe("Comment text"),
        }),
    }
);

export const getComments = tool(
    async ({ issueKey }) => {
        try {
            const response = await jira.issueComments.getComments({
                issueIdOrKey: issueKey,
            });

            // Map complex ADF content to simple strings for agent readability
            const comments = response.comments?.map((c) => ({
                author: c.author?.displayName,
                created: c.created,
                body: c.body?.content
                    ?.map((p: any) => p.content?.map((t: any) => t.text).join(""))
                    .join("\n"),
            }));

            return { issueKey, comments };
        } catch (error: any) {
            return { error: error.message };
        }
    },
    {
        name: "get_comments",
        description: "Get all comments from a Jira issue.",
        schema: z.object({
            issueKey: z.string().describe("Issue key"),
        }),
    }
);
