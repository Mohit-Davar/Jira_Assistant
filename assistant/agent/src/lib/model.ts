import { initChatModel } from "langchain";
export const model = await initChatModel("openai:gpt-5-nano", {
    apiKey: process.env.OPENAI_API_KEY,
    maxTokens: 500,
})