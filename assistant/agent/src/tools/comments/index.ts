import {
  addCommentConfig,
  getCommentsConfig,
  updateCommentConfig,
  deleteCommentConfig,
} from '@/tools/comments/types.js';
import {
  addCommentCallback,
  getCommentsCallback,
  updateCommentCallback,
  deleteCommentCallback,
} from '@/tools/comments/callbacks.js';

export const commentTools = [
  { name: 'add_comment', config: addCommentConfig, callback: addCommentCallback },
  { name: 'get_comments', config: getCommentsConfig, callback: getCommentsCallback },
  { name: 'update_comment', config: updateCommentConfig, callback: updateCommentCallback },
  { name: 'delete_comment', config: deleteCommentConfig, callback: deleteCommentCallback },
];
