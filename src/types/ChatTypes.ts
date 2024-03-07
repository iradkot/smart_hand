export type UserRole = 'user' | 'gpt';

export interface ChatEntry {
  role: UserRole;
  content: string;
}

export interface gptChatTableSegment {
  content: TableRow[];
}

export interface gptChatCodeSegment {
  content: string;
}

// Assuming TableRow remains unchanged but moving it for cohesion
export type TableRow = string[];
