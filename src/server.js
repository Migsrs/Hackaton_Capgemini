import express from 'express';
import cors from 'cors'; // Importando o CORS
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { loadMcpTools } from '@langchain/mcp-adapters';
import { exec } from 'child_process';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors()); // Permite requisições de qualquer origem

app.use(express.json());

app.get('/status', async (req, res) => {
	return JSON.stringify({
		status: 200,
		message: 'Server up and running...',
	});
});

app.post('/execute', async (req, res) => {
	try {
		const { combinedResumes, descriptionText } = req.body;

		const messages = [
			{
				role: 'system',
				content:
					'You are an HR expert. Follow the instructions carefully and use the descriptive.',
			},

			// 1) Descritivo destacado e curto
			{ role: 'user', name: 'job_description', content: descriptionText },

			// 2) Currículos em JSON legível (um por candidato)
			{
				role: 'user',
				name: 'resumes',
				content: JSON.stringify(combinedResumes, null, 2),
			},

			// 3) Tarefa clara com etapas (classificar -> explicar -> só depois e-mail)
			{
				role: 'user',
				content: `
        Task:
        1) First read the DESCRIPTION ('job_description' message).
        2) Then evaluate EACH resume ('resumes' message) against the description.
        3) Produce a ranking with scores and justifications (30 words or more) citing the requirements of the description.
        4) Only after the ranking, generate the 5 personalized emails.

        Reply **only in PT-BR**.
        `,
			},
		];

		const model = new ChatOpenAI({
			model: 'gpt-4o',
			apiKey: process.env.OPENAI_API_KEY,
		});

		const transport = new StdioClientTransport({
			command: 'python',
			args: ['./mcptools/mail.py'],
		});

		const client = new Client({
			name: 'mail-client',
			version: '1.0.0',
		});

		await client.connect(transport);

		const tools = await loadMcpTools('mail', client);
		const agent = createReactAgent({
			llm: model,
			tools,
			prompt:
				"You MUST use the 'mail' tool exclusively to send emails." +
				"Never write the final email in the chat: always call the 'mail' tool, passing in the required fields.",
		});

		const agentResponse = await agent.invoke({
			messages,
		});

    const filteredMessages = agentResponse.messages.filter(item => !((item instanceof HumanMessage) || (item instanceof SystemMessage)))

		await client.close();

		res.json({ response: filteredMessages });
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: e.message });
	}
});

app.listen(port, () => {
	console.log(`Servidor ouvindo na porta ${port}`);
});
