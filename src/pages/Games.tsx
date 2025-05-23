// src/pages/Games.tsx
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import { getGames, addGame, removeGame, Game, GamePlayer } from '../services/gamesService';
import { getPlayers, Player } from '../services/playersService';

export default function Games() {
  const [user] = useAuthState(auth);
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<GamePlayer[]>([]);
  const [gameDate, setGameDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    const [gamesData, playersData] = await Promise.all([
      getGames(user.uid),
      getPlayers(user.uid),
    ]);
    setGames(gamesData);
    setPlayers(playersData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAddPlayerToGame = (playerId: string) => {
    if (selectedPlayers.find((p) => p.playerId === playerId)) return;
    setSelectedPlayers([...selectedPlayers, { playerId, position: 1 }]);
  };

  const handlePositionChange = (playerId: string, position: number) => {
    setSelectedPlayers((prev) =>
      prev.map((p) =>
        p.playerId === playerId ? { ...p, position } : p
      )
    );
  };

  const handleRemovePlayerFromGame = (playerId: string) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.playerId !== playerId));
  };

  const handleAddGame = async () => {
    if (!user || selectedPlayers.length < 4 || selectedPlayers.length > 6 || !gameDate) return;
    try {
      await addGame(user.uid, selectedPlayers, gameDate);
      setSelectedPlayers([]);
      setGameDate('');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveGame = async (id?: string) => {
    if (!user || !id) return;
    await removeGame(user.uid, id);
    fetchData();
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white border border-gray-200 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Partidas</h2>

      <div className="mb-4">
        <p className="mb-2">Selecione de 4 a 6 jogadores:</p>
        {players.length === 0 && (
          <p className="text-sm text-red-500">Nenhum jogador encontrado.</p>
        )}
        <div className="flex flex-wrap gap-2 mb-2">
          {players.map((player) => {
            const isSelected = selectedPlayers.find((p) => p.playerId === player.id);
            return (
              <button
                key={player.id}
                onClick={() => handleAddPlayerToGame(player.id!)}
                disabled={!!isSelected}
                className={`px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50 ${isSelected ? 'cursor-not-allowed' : ''}`}
              >
                {player.name} {isSelected ? '✓' : ''}
              </button>
            );
          })}
        </div>

        <label className="block mb-2">
          <span className="text-sm">Data da partida:</span>
          <input
            type="date"
            value={gameDate}
            onChange={(e) => setGameDate(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
          />
        </label>

        <div className="space-y-2">
          {selectedPlayers.map(({ playerId, position }) => {
            const player = players.find((p) => p.id === playerId);
            return (
              <div key={playerId} className="flex items-center gap-2">
                <span className="flex-1">{player?.name}</span>
                <input
                  type="number"
                  min={1}
                  max={selectedPlayers.length}
                  value={position}
                  onChange={(e) => handlePositionChange(playerId, Number(e.target.value))}
                  className="w-16 p-1 border rounded"
                />
                <button
                  onClick={() => handleRemovePlayerFromGame(playerId)}
                  className="text-red-600 hover:underline"
                >
                  Remover
                </button>
              </div>
            );
          })}
        </div>
        <button
          onClick={handleAddGame}
          disabled={selectedPlayers.length < 4 || selectedPlayers.length > 6 || !gameDate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Salvar Partida
        </button>
      </div>

      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul className="space-y-4">
          {games.map((g) => (
            <li key={g.id} className="p-4 border rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  {g.date || g.createdAt.toDate().toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleRemoveGame(g.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remover
                </button>
              </div>
              <ul className="space-y-1">
                {g.players.map(({ playerId, position }) => {
                  const player = players.find((p) => p.id === playerId);
                  return (
                    <li key={playerId}>
                      {player?.name || 'Jogador desconhecido'} - Posicao: {position}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}