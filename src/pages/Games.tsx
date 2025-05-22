import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import { addGame, Game, getGames, removeGame } from "../services/gamesService";
import { getPlayers, Player } from "../services/playersService";

export default function Games() {
  const [user] = useAuthState(auth);
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    const [g, p] = await Promise.all([
      getGames(user.uid),
      getPlayers(user.uid),
    ]);
    setGames(g);
    setPlayers(p);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAdd = async () => {
    if (!user || !player1 || !player2 || player1 === player2) return;
    try {
      await addGame(user.uid, player1, player2, Number(score1), Number(score2));
      setPlayer1("");
      setPlayer2("");
      setScore1("");
      setScore2("");
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemove = async (id?: string) => {
    if (!user || !id) return;
    await removeGame(user.uid, id);
    fetchData();
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white border border-gray-200 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Jogos</h2>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <select
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Jogador 1</option>
          {players.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Jogador 2</option>
          {players.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          value={score1}
          onChange={(e) => setScore1(e.target.value)}
          type="number"
          className="p-2 border rounded"
          placeholder="Placar 1"
        />
        <input
          value={score2}
          onChange={(e) => setScore2(e.target.value)}
          type="number"
          className="p-2 border rounded"
          placeholder="Placar 2"
        />
        <button
          onClick={handleAdd}
          className="col-span-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={
            !player1 ||
            !player2 ||
            player1 === player2 ||
            score1 === "" ||
            score2 === ""
          }
        >
          Adicionar Jogo
        </button>
      </div>

      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul className="space-y-2">
          {games.map((g) => (
            <li
              key={g.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <span>
                {g.player1} {g.score1} x {g.score2} {g.player2}
              </span>
              <button
                onClick={() => handleRemove(g.id)}
                className="text-red-600 hover:underline"
              >
                Remover
              </button>
            </li>
          ))}
          {games.length === 0 && (
            <li className="text-gray-500">Nenhum jogo cadastrado.</li>
          )}
        </ul>
      )}
    </div>
  );
}
