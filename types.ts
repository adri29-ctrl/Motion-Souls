export enum Emotion {
  NEUTRAL = 'Neutral',
  JOY = 'Joy',
  SADNESS = 'Sadness',
  ANGER = 'Anger',
  SURPRISE = 'Surprise',
  THINKING = 'Thinking'
}

export interface SoulResponse {
  emotion: Emotion;
  thought_process: string;
  response: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    emotion?: Emotion;
    thought?: string;
  };
}

export interface MemoryCore {
  shortTerm: string[];
  lastEmotion: Emotion;
  interactionsCount: number;
}