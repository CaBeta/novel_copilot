import { ChatCompletionCreateParams } from "openai";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface INovelCopilotAPI {
  completion: (params: ChatCompletionCreateParams) => Promise<string>;
  stream: (params: ChatCompletionCreateParams) => Promise<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (channel: string, callback: (event: unknown, data: any) => void) => void;
}

declare global {
  interface Window {
    novelCopilotAPI: INovelCopilotAPI;
  }
}
