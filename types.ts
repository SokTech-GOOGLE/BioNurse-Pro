export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export type AIProvider = 'gemini' | 'openai';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  LEARNING = 'LEARNING',
  PROFILE = 'PROFILE',
  DONATE = 'DONATE'
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0 for A, 1 for B, etc.
}

export interface QuizModule {
  id: string;
  title: string;
  questions: QuizQuestion[];
}
