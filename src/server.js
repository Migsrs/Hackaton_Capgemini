import express from "express";
import cors from "cors";
import multer from "multer";
import { getDocument } from "pdfjs-dist";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { Document } from "langchain/document";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();


async function extractTextFromPDF(fileBuffer) {
    // Converter o buffer para um stream para compatibilidade com pdfjs-dist
    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);

    const loadingTask = getDocument({ data: fileBuffer });
    const pdf = await loadingTask.promise;
    
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Concatenando o texto de todas as páginas
        text += textContent.items.map(item => item.str).join(" ") + "\n";
    }

    return text;
}

const app = express();
const upload = multer(); // Middleware para lidar com uploads de arquivos

app.use(cors()); // Permitir requisições de outros domínios
app.use(express.json());

app.post("/upload-pdf", upload.array("files"), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    try {
        // Extrair o texto do PDF
        const docs = await Promise.all(req.files.map(async (file) => {
            const text = await extractTextFromPDF(file.buffer);
            return new Document({ pageContent: text });
        }));

        const model = new ChatOpenAI({
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
        
        res.json({"text": response});

        

       
    } catch (error) {
        console.error("Erro ao processar o PDF:", error);
        res.status(500).json({ error: "Erro ao processar o PDF" });
    }
});


// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
