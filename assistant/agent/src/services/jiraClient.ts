import { Version3Client } from 'jira.js';

export const jira = new Version3Client({
    host: process.env.JIRA_HOST!,
    authentication: {
        basic: {
            email: process.env.JIRA_EMAIL!,
            apiToken: process.env.JIRA_TOKEN!,
        },
    },
});

