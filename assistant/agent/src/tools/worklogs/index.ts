import {
  addWorklogConfig,
  getWorklogsConfig,
  updateWorklogConfig,
  deleteWorklogConfig,
} from './types.js';
import {
  addWorklogCallback,
  getWorklogsCallback,
  updateWorklogCallback,
  deleteWorklogCallback,
} from './callback.js';

export const worklogTools = [
  { name: 'add_worklog', config: addWorklogConfig, callback: addWorklogCallback },
  { name: 'get_worklogs', config: getWorklogsConfig, callback: getWorklogsCallback },
  { name: 'update_worklog', config: updateWorklogConfig, callback: updateWorklogCallback },
  { name: 'delete_worklog', config: deleteWorklogConfig, callback: deleteWorklogCallback },
];
