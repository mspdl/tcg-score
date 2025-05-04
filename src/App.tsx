import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "./services/firebase";

function App() {
  useEffect(() => {
    const testLogin = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          "email@exemplo.com", // coloque um e-mail real
          "senha123" // coloque a senha correspondente
        );
        console.log("Login bem-sucedido:", userCredential.user);
      } catch (error) {
        console.error("Erro ao fazer login:", error);
      }
    };

    testLogin();
  }, []);

  return <div>Testando login... veja o console</div>;
}

export default App;
