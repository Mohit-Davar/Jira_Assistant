import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import 'dotenv/config';
import { allTools } from './tools/index.js';

const server = new McpServer({
  name: 'jira-mcp-server',
  version: '1.0.0',
});

for (const tool of allTools) {
  server.registerTool(tool.name, tool.config, tool.callback as any);
}

const app = express();
app.use(express.json());
app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on('close', () => {
    transport.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(3000, () => {
  console.log('MCP Server is running on port 3000');
});
