import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Game {
  id?: string;
  player1: string;
  player2: string;
  score1: number;
  score2: number;
  createdAt: Timestamp;
}

export const getGames = async (userId: string): Promise<Game[]> => {
  const q = query(
    collection(db, `users/${userId}/games`),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Game, "id">),
  }));
};

export const addGame = async (
  userId: string,
  player1: string,
  player2: string,
  score1: number,
  score2: number
) => {
  return addDoc(collection(db, `users/${userId}/games`), {
    player1,
    player2,
    score1,
    score2,
    createdAt: Timestamp.now(),
  });
};

export const removeGame = async (userId: string, gameId: string) => {
  return deleteDoc(doc(db, `users/${userId}/games/${gameId}`));
};
