import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import * as dotenv from "dotenv";

const filepath = "./files/Plano_Ensino_2025_1sem_INSTALAÇÕES ELETRICAS_Turma_06V_Teoria_MSV.pdf";

const loader = new PDFLoader(filepath, {
    splitPages: false,
});
const docs = await loader.load();

const model = new ChatOpenAI({
    openAIApiKey: "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",
    temperature: 0.7,
});

const prompt = ChatPromptTemplate.fromTemplate(`
    Answer the user's question. 
    Context: {context}
    Question: {input}
`);

const chain = await createStuffDocumentsChain({
    llm: model,
    prompt,
});

const response = await chain.invoke({
    input: "Com base no plano de ensino fornecido, gere uma rotina de estudos para o semestre. A rotina deve os conteúdos que devem ser estudados semanalmente para manter a matéria em dia.",
    context: docs,
});

console.log(response);