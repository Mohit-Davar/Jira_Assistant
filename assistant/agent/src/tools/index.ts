import {
  createIssueUITool, issueDetailUITool, issueSearchUITool,
} from '@/hybrid/tools/issuesUI.tool.js';
import { deleteAttachment, getAttachment } from '@/tools/attachments.tool.js';
import { getIssueChangelog } from '@/tools/changelog.tool.js';
import {
  addComment, deleteComment, getComments,
  updateComment,
} from '@/tools/comments.tool.js';
import {
  assignIssue, createIssue, deleteIssue,
  getIssue, searchIssues, updateIssue,
} from '@/tools/issues.tool.js';
import {
  deleteIssueLink, getIssueLinks, getLinkTypes,
  linkIssues,
} from '@/tools/links.tool.js';
import { getProject, listProjects } from '@/tools/projects.tool.js';
import { getTransitions, transitionIssue } from '@/tools/transitions.tool.js';
import { findUsers, getCurrentUser } from '@/tools/users.tool.js';
import {
  addWorklog, deleteWorklog, getWorklogs,
  updateWorklog,
} from '@/tools/worklogs.tool.js';

export const allTools = [
  // UI-streaming tools (bypass LLM, direct to frontend)
  issueSearchUITool,
  issueDetailUITool,
  createIssueUITool,

  // Standard tools (text → LLM → user)
  // issues
  searchIssues,
  getIssue,
  createIssue,
  updateIssue,
  assignIssue,
  deleteIssue,
  getIssueChangelog,

  // comments
  addComment,
  getComments,
  updateComment,
  deleteComment,

  // transitions
  transitionIssue,
  getTransitions,

  // projects
  listProjects,
  getProject,

  // users
  findUsers,
  getCurrentUser,

  // worklogs
  addWorklog,
  getWorklogs,
  updateWorklog,
  deleteWorklog,

  // attachments
  getAttachment,
  deleteAttachment,

  // links
  linkIssues,
  getIssueLinks,
  deleteIssueLink,
  getLinkTypes,
];
