import type { Timestamp } from "firebase/firestore";

export interface Loop {
  id: string;
  userId: string;
  prompt: string;
  language: string;
  code: string;
  explanation?: string;
  experienceLevel?: 'junior' | 'mid' | 'senior';
  parentLoopId?: string | null;
  createdAt: Timestamp;
}
