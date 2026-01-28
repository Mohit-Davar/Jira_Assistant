import * as z from 'zod';

export const addCommentConfig = {
  description: 'Add a comment to a Jira issue.',
  inputSchema: z.object({
    issueKey: z.string().describe('Issue key'),
    comment: z.string().describe('Comment text'),
  }),
};
export type AddCommentInput = z.infer<typeof addCommentConfig.inputSchema>;

export const getCommentsConfig = {
  description: 'Get all comments from a Jira issue.',
  inputSchema: z.object({
    issueKey: z.string().describe('Issue key'),
  }),
};
export type GetCommentsInput = z.infer<typeof getCommentsConfig.inputSchema>;

export const updateCommentConfig = {
  description: 'Update an existing comment on a Jira issue.',
  inputSchema: z.object({
    issueKey: z.string().describe('Issue key'),
    commentId: z.string().describe('ID of the comment. Use get_comments to get this.'),
    comment: z.string().describe('New comment text'),
  }),
};
export type UpdateCommentInput = z.infer<typeof updateCommentConfig.inputSchema>;

export const deleteCommentConfig = {
  description: 'Delete a comment from a Jira issue.',
  inputSchema: z.object({
    issueKey: z.string().describe('Issue key'),
    commentId: z.string().describe('ID of the comment. Use get_comments to get this.'),
  }),
};
export type DeleteCommentInput = z.infer<typeof deleteCommentConfig.inputSchema>;
