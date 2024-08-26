import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const config = makeConfig();

const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = "edge";

function makeConfig(): Configuration {
  const useAzure = process.env["USE_AZURE"] && ["true", "1"].includes(process.env["USE_AZURE"].toLocaleLowerCase().trim());

  if (useAzure) {
    return new Configuration({
      apiKey: process.env["AZURE_OPENAI_API_KEY"],
      baseOptions: {
        headers: {
          "api-key": process.env["AZURE_OPENAI_API_KEY"],
        }
      },
      basePath: `https://${process.env["AZURE_OPENAI_RESOURCE_NAME"]}.openai.azure.com/openai/deployments/${process.env["AZURE_OPENAI_DEPLOYMENT_NAME"]}`,
      defaultQueryParams: new URLSearchParams({
        "api-version": process.env["AZURE_OPENAI_API_VERSION"]!, 
      }),
    })
  } else {
    return new Configuration({
      apiKey: process.env["OPENAI_API_KEY"],
    });
  }
}

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
    messages: [{'role': 'system', 'content': 'You are a helpful AI assistant named GPT, you may format your reply in Markdown if necessary. '}, ...messages],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
