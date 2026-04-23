export type ChatRole = "user" | "bot";

export interface ChatItem {
  role: ChatRole;
  text: string;
  timestamp: number;
}
