import z from 'zod';

import {
    instructions,
} from '@/agents/sub-agents/guardrail/input-guardrail/instructions.js';
import { Agent, InputGuardrail, run } from '@openai/agents';

export const inputGuardrailAgent = new Agent({
    name: "Input Guardrail Agent",
    instructions: instructions(),
    outputType: z.object({
        allow: z.boolean()
    }),
    model: "gpt-5-nano"
})

export const inputGuardrail: InputGuardrail = {
    name: "Input Guardrail",
    runInParallel: false,
    execute: async ({ input }) => {
        const result = await run(inputGuardrailAgent, input);
        return {
            tripwireTriggered: !result.finalOutput?.allow,
            outputInfo: result.finalOutput
        }
    }
}