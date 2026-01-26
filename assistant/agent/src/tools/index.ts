import { searchIssues, getIssue } from "@/tools/issues.tool.js";
import { createIssue, updateIssue } from "@/tools/mutations.tool.js";
import { addComment, getComments } from "@/tools/comments.tool.js";
import { transitionIssue, getTransitions } from "@/tools/transitions.tool.js";
import { listProjects, getProject, getCurrentUser } from "@/tools/projects.tool.js";

export const allTools = [
    searchIssues,
    getIssue,
    getComments,
    getTransitions,
    listProjects,
    getProject,
    getCurrentUser,
    createIssue,
    updateIssue,
    addComment,
    transitionIssue,
];
