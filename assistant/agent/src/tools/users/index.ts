import { findUsersConfig, getCurrentUserConfig } from './types.js';
import { findUsersCallback, getCurrentUserCallback } from './callback.js';

export const userTools = [
  { name: 'find_users', config: findUsersConfig, callback: findUsersCallback },
  { name: 'get_current_user', config: getCurrentUserConfig, callback: getCurrentUserCallback },
];
