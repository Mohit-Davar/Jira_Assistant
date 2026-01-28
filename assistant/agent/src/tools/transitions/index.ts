import { transitionIssueConfig, getTransitionsConfig } from '@/tools/transitions/types.js';
import { transitionIssueCallback, getTransitionsCallback } from '@/tools/transitions/callbacks.js';

export const transitionTools = [
  { name: 'transition_issue', config: transitionIssueConfig, callback: transitionIssueCallback },
  { name: 'get_transitions', config: getTransitionsConfig, callback: getTransitionsCallback },
];
