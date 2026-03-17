export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  provider: string;
  systemPrompt: string | null;
  messages: Message[];
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  modelId: string;
}
