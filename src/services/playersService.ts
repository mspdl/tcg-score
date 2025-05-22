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

export interface Player {
  id?: string;
  name: string;
  createdAt: Timestamp;
}

export const getPlayers = async (userId: string): Promise<Player[]> => {
  const q = query(
    collection(db, `users/${userId}/players`),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Player, "id">),
  }));
};

export const addPlayer = async (userId: string, name: string) => {
  return addDoc(collection(db, `users/${userId}/players`), {
    name,
    createdAt: Timestamp.now(),
  });
};

export const removePlayer = async (userId: string, playerId: string) => {
  return deleteDoc(doc(db, `users/${userId}/players/${playerId}`));
};
