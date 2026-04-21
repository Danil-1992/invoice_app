import React, { useState } from 'react';
import { styles } from "./styles";
import SignUpPage from '../SignUpPage/SignUpPage';
import SignInPage from '../SignInPage/SignInPage';

export default function Enter(): React.JSX.Element {
  const [activeButton, setActiveButton] = useState<string | null>('register');
  const handleButtonClick = (buttonName: string): void => {
    setActiveButton(buttonName);
  };
  return (
    <>
      <div style={styles.container}>
        <button
          onClick={() => handleButtonClick('register')}
          style={{
            ...styles.button,
            backgroundColor: activeButton === 'register' ? '#4CAF50' : '#f0f0f0', // Меняем цвет в зависимости от выбранной кнопки
          }}
        >
          Зарегистрироваться
        </button>
        <button
          onClick={() => handleButtonClick('login')}
          style={{
            ...styles.button,
            backgroundColor: activeButton === 'login' ? '#4CAF50' : '#f0f0f0', // Меняем цвет в зависимости от выбранной кнопки
          }}
        >
          Войти
        </button>
      </div>
      <div>{activeButton === 'login' ? <SignInPage /> : <SignUpPage />}</div>
    </>
  );
}
