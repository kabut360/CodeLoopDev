import type { Timestamp } from "firebase/firestore";

export interface Loop {
  id: string;
  userId: string;
  prompt: string;
  language: string;
  code: string;
  explanation?: string;
  parentLoopId?: string | null;
  createdAt: Timestamp;
}
