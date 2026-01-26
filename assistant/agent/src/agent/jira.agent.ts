import { createAgent } from "langchain";
import { allTools } from "@/tools/index.js";
import { model } from "@/lib/model.js";

export function createJiraAgent() {
    return createAgent({
        model,
        tools: allTools,
        systemPrompt: `
            You are a Jira Assistant.
            Respond in natural language.
            Never invent data.
            Ask for missing info.
            Explain tool errors clearly.
            Never suggest next questions.
        `,
    });
}
