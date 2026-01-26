import { tool } from "langchain";
import * as z from "zod";
import { jira } from "@/services/jiraClient.js";
import { formatSearchResult, formatIssueFields } from "@/lib/fm.js";

export const searchIssues = tool(
    async ({ jql, maxResults, fields }) => {
        try {
            const response =
                await jira.issueSearch.searchForIssuesUsingJqlEnhancedSearch({
                    jql,
                    maxResults,
                    fields,
                });

            if (!response.issues?.length) {
                return "No issues found matching the query.";
            }

            const issues = response.issues.map(formatSearchResult);
            return JSON.stringify(issues, null, 2);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            return `Error searching issues: ${message}`;
        }
    },
    {
        name: "issue_search",
        description: "Search Jira issues using JQL to find bugs, tasks, or tickets.",
        schema: z.object({
            jql: z.string().describe("JQL query"),
            maxResults: z.number().default(20),
            fields: z
                .array(z.string())
                .default([
                    "summary",
                    "duedate",
                    "assignee",
                    "priority",
                    "status",
                    "created",
                ])
                .describe("Fields to fetch"),
        }),
    }
);


export const getIssue = tool(
    async ({ issueIdOrKey, fields }) => {
        try {
            const issue = await jira.issues.getIssue({
                issueIdOrKey,
                fields,
            });

            const result = formatIssueFields(issue.fields);
            return JSON.stringify(result, null, 2);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            return `Error getting issue: ${message}`;
        }
    },
    {
        name: "get_issue",
        description: "Get details of a specific Jira issue.",
        schema: z.object({
            issueIdOrKey: z.string().describe("Issue key or ID"),
            fields: z
                .array(z.string())
                .default([
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
                ])
                .describe("Fields to fetch"),
        }),
    }
);

