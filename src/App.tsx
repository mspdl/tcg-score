import { useAuthState } from "react-firebase-hooks/auth";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { JSX } from "react/jsx-runtime";
import Championships from "./pages/Championships";
import ChampionshipView from "./pages/ChampionshipView";
import Games from "./pages/Games";
import Login from "./pages/Login";
import Players from "./pages/Players";
import { auth } from "./services/firebase";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Carregando...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/campeonato/:id" element={<ChampionshipView />} />{" "}
        {/* Pública */}
        <Route
          path="/campeonatos"
          element={
            <ProtectedRoute>
              <Championships />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jogos"
          element={
            <ProtectedRoute>
              <Games />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jogadores"
          element={
            <ProtectedRoute>
              <Players />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/campeonatos" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
