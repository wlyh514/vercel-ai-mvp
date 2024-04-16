import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = (await req.json()) as {
    messages: ChatCompletionRequestMessage[];
  };
  if (!messages) {
    return new Response('', {status: 400});
  }

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    stream: true,
    temperature: 1,
    messages: [{'role': 'system', 'content': 'You are a helpful AI assistant called GPT-4, you may format your reply in Markdown if necessary. '}, ...messages],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
