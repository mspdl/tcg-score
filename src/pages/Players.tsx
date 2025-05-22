import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import { addPlayer, getPlayers, removePlayer, Player } from '../services/playersService';

export default function Players() {
  const [user] = useAuthState(auth);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getPlayers(user.uid);
    setPlayers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAdd = async () => {
    if (!user || !newName.trim()) return;
    try {
      await addPlayer(user.uid, newName.trim());
      setNewName('');
      fetchPlayers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemove = async (id?: string) => {
    if (!user || !id) return;
    await removePlayer(user.uid, id);
    fetchPlayers();
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-white border border-gray-200 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Jogadores</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="Nome do jogador"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          disabled={!newName.trim()}
        >
          Adicionar
        </button>
      </div>

      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul className="space-y-2">
          {players.map((p) => (
            <li key={p.id} className="flex items-center justify-between p-2 border rounded-lg">
              <span>{p.name}</span>
              <button
                onClick={() => handleRemove(p.id)}
                className="text-red-600 hover:underline"
              >
                Remover
              </button>
            </li>
          ))}
          {players.length === 0 && <li className="text-gray-500">Nenhum jogador cadastrado.</li>}
        </ul>
      )}
    </div>
  );
}