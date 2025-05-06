import { useAuthState } from "react-firebase-hooks/auth";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { JSX } from "react/jsx-runtime";
import Navigation from "./components/Navigation"; // Importando o componente Navigation
import Championships from "./pages/Championships";
import ChampionshipView from "./pages/ChampionshipView";
import Games from "./pages/Games";
import { Home } from "./pages/Home";
import Login from "./pages/Login";
import Players from "./pages/Players";
import SignUp from "./pages/SignUp";
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
      <Navigation />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/campeonato/:id" element={<ChampionshipView />} />
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
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
