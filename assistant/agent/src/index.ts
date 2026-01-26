import "dotenv/config";
import { createJiraAgent } from "@/agent/jira.agent.js";

const agent = createJiraAgent();

async function chat(query: string): Promise<string> {
    try {
        const result = await agent.invoke({
            messages: [{ role: "user", content: query }],
        });
        return result.messages[result.messages.length - 1].content as string;
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return `Error: ${message}`;
    }
}

chat("Explain issue LJ-1").then((value) => console.log(value));
