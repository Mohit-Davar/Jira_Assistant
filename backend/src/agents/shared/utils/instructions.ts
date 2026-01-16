// Core guardrails that apply to most agents to ensure safe and correct behavior.
export const CORE_GUARDRAILS = `
Do not assume or invent data.
Respond in natural language.
`.trim();

// Standard rules for tool usage.
export const TOOL_USAGE_RULES = `
Allow tools to ask missing info and enquire user about it.
Explain errors by tools.
`.trim();

// Helper to join prompt parts with proper spacing.
export const compose = (...parts: (string | undefined | null)[]): string => {
    return parts.filter(Boolean).join('\n');
};
