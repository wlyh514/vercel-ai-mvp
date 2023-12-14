export type Message = {
    id: string;
    createdAt?: Date;
    content: string;
    role: 'system' | 'user' | 'assistant' | 'function' | 'data';
    name?: string;
    function_call?: string | ChatCompletionRequestMessageFunctionCall;
};