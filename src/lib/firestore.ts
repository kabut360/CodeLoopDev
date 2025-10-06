import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { getDb } from "./firebase";
import type { Loop } from "@/types";

// Note: db is now a function getDb()
const loopsCollection = collection(getDb(), "loops");

export async function addLoop(loopData: Omit<Loop, "id" | "createdAt" | "explanation"> & { explanation?: string }): Promise<string> {
  const docRef = await addDoc(loopsCollection, {
    ...loopData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getLoop(id: string): Promise<Loop | null> {
  const docRef = doc(getDb(), "loops", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Loop;
  } else {
    return null;
  }
}

export async function getLoopsByUser(userId: string): Promise<Loop[]> {
  const q = query(
    loopsCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Loop));
}
