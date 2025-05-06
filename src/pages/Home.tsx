import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <h1>Bem-vindo ao sistema de gerenciamento de campeonatos!</h1>
      <p>
        Faça <Link to={"/login"}>login</Link> ou busque por um campeonato
      </p>
    </div>
  );
};
