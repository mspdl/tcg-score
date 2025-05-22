import { useState, useEffect } from 'react';

const SignUp = () => {
  const [captchaText] = useState(() => Math.random().toString(36).substring(2, 8));
  const [userInput, setUserInput] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [captchaMessage, setCaptchaMessage] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    const validateEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    setIsEmailValid(validateEmail(email));

    const allValid =
      email.trim() !== '' &&
      validateEmail(email) &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword &&
      isCaptchaValid;

    setCanSubmit(allValid);
  }, [email, password, confirmPassword, isCaptchaValid]);

  const handleCaptchaCheck = () => {
    if (userInput === captchaText) {
      setIsCaptchaValid(true);
      setCaptchaMessage('✅ Verificação concluída com sucesso!');
    } else {
      setIsCaptchaValid(false);
      setCaptchaMessage('❌ Texto incorreto, tente novamente.');
    }
  };

  return (
    <div>
      <h2>Cadastro</h2>
      <form>
        <span>E-mail: </span>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        {!isEmailValid && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            Email inválido
          </div>
        )}

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />

        <input
          type="password"
          placeholder="Repita a senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        /><br />

        {(password !== confirmPassword || confirmPassword === '') && (
          <div style={{ color: 'red', marginBottom: '10px' }}>
            {confirmPassword === ''
              ? 'Confirme sua senha'
              : 'As senhas não coincidem'}
          </div>
        )}

        <p>Digite o texto abaixo para continuar:</p>
        <div style={{ fontWeight: 'bold', fontSize: '20px', letterSpacing: '3px' }}>
          {captchaText}
        </div>

        <input
          type="text"
          placeholder="Digite aqui"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="button" onClick={handleCaptchaCheck}>
          Verificar
        </button>

        <div style={{ marginTop: '10px', color: isCaptchaValid ? 'green' : 'red' }}>
          {captchaMessage}
        </div>

        <br />
        <button type="submit" disabled={!canSubmit}>Cadastrar</button>
      </form>
    </div>
  );
};

export default SignUp;
