import { ChatOpenAI, OpenAI } from "@langchain/openai";

import * as dotenv from "dotenv";
dotenv.config();

const model = new OpenAI({
    temperature: 0.7
})

const response = await model.invoke("Why is the sky blue?");
console.log(response);