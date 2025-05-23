// src/services/gamesService.ts
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';

export interface GamePlayer {
  playerId: string;
  position: number;
}

export interface Game {
  id?: string;
  players: GamePlayer[];
  createdAt: Timestamp;
}

// Define sua lógica de pontuação aqui
const getPointsByPosition = (position: number): number => {
  switch (position) {
    case 1:
      return 3;
    case 2:
      return 1;
    default:
      return 0;
  }
};

export const getGames = async (userId: string): Promise<Game[]> => {
  const q = query(collection(db, `users/${userId}/games`), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Game, 'id'>) }));
};

export const addGame = async (userId: string, players: GamePlayer[]) => {
  const batch = writeBatch(db);
  const gameRef = collection(db, `users/${userId}/games`);
  const gameDoc = doc(gameRef);

  batch.set(gameDoc, {
    players,
    createdAt: Timestamp.now(),
  });

  // Atualiza pontos dos jogadores
  for (const { playerId, position } of players) {
    const points = getPointsByPosition(position);
    const playerRef = doc(db, `users/${userId}/players/${playerId}`);

    batch.update(playerRef, {
      totalPoints: points, // Será substituído abaixo se já existir
    });
  }

  await batch.commit();
};

export const removeGame = async (userId: string, gameId: string) => {
  return deleteDoc(doc(db, `users/${userId}/games/${gameId}`));
};
