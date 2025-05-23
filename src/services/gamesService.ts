// src/services/gamesService.ts
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  query,
  where,
} from 'firebase/firestore';

export interface GamePlayer {
  playerId: string;
  position: number;
}

export interface Game {
  id?: string;
  players: GamePlayer[];
  createdAt: Timestamp;
  date?: string;
}

export async function addGame(
  userId: string,
  players: GamePlayer[],
  date: string
): Promise<void> {
  const gamesCollection = collection(db, 'users', userId, 'games');
  await addDoc(gamesCollection, {
    players,
    date,
    createdAt: Timestamp.now(),
  });
}

export async function getGames(userId: string): Promise<Game[]> {
  const gamesCollection = collection(db, 'users', userId, 'games');
  const snapshot = await getDocs(query(gamesCollection));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Game));
}

export async function removeGame(userId: string, gameId: string): Promise<void> {
  const gameDoc = doc(db, 'users', userId, 'games', gameId);
  await deleteDoc(gameDoc);
}
