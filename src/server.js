import express from 'express';
import cors from 'cors';  // Importando o CORS
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { loadMcpTools } from '@langchain/mcp-adapters';
import { exec } from 'child_process';
import * as dotenv from "dotenv";

dotenv.config()

const app = express();
const port = 3000;

app.use(cors());  // Permite requisições de qualquer origem

app.use(express.json());

app.post('/execute', async (req, res) => {
  try {
    const { modelName, expression } = req.body;

    const model = new ChatOpenAI({ modelName });

    const transport = new StdioClientTransport({
      command: 'python',
      args: ['./mcptools/mail.py'],
    });

    const client = new Client({
      name: 'mail-client',
      version: '1.0.0',
    });

    await client.connect(transport);

    const tools = await loadMcpTools("mail", client);
    const agent = createReactAgent({ llm: model, tools });

    const agentResponse = await agent.invoke({
      messages: [{ role: 'user', content: expression }],
    });

    await client.close();

    res.json({ response: agentResponse });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});
