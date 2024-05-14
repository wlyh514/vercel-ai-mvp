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

  try {
    const { messages } = (await req.json()) as {
      messages: ChatCompletionRequestMessage[];
    };
    if (!messages) {
      return new Response(null, { status: 400 });
    }

    // Ask OpenAI for a streaming completion given the prompt
    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      stream: true,
      temperature: 1,
      messages: [{ 'role': 'system', 'content': 'You are a helpful AI assistant GPT-4o, you may format your reply in Markdown if necessary. ' }, ...messages],
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (e) {
    console.error(e);
    return new Response(null, { status: 500 });
  }
}
