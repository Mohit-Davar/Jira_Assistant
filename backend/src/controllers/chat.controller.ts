import { Request, Response } from "express";
import { z } from "zod";
import { run, InputGuardrailTripwireTriggered } from "@openai/agents";
import { agent } from "@/agents/orchestrator/agent.js";
import { sendSSE } from "@/utils/chat.utils.js";
import fs from "fs";

export const handleChatQuery = async (req: Request, res: Response) => {
    try {
        const { query } = z.object({ query: z.string() }).parse(req.body);

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        try {
            const result = await run(agent, query, { stream: true });

            const stream = result.toTextStream({
                compatibleWithNodeStreams: true,
            });

            stream.on("data", (chunk) => {
                sendSSE(res, chunk.toString());
            });

            stream.on("end", () => res.end());

            stream.on("error", () => {
                sendSSE(res, "Internal Server Error", true);
                res.end();
            });
        } catch (err) {
            if (err instanceof InputGuardrailTripwireTriggered) {
                sendSSE(res, "Ask a valid Jira Query.");
            } else {
                sendSSE(res, "Internal Server Error", true);
            }
            res.end();
        }
    } catch {
        if (!res.headersSent) {
            res.status(400).json({ error: "Invalid request" });
        }
    }
};
