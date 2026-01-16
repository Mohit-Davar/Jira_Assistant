import { Response } from "express";

export const sendSSE = (
    res: Response,
    data: string,
    isError = false
) => {
    if (res.writableEnded) return;

    const event = isError ? "error" : "data";
    res.write(`${event}: ${JSON.stringify(data)}\n\n`);
};
