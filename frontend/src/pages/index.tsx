import { FC, FormEvent, useRef, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

import api from "@/services/api";

import styles from "@/styles/login.module.scss";

const Login: FC<{ BASE_URL: string }> = ({ BASE_URL }) => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const togglePassword = () => {
    setShow(!show);
  };

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current?.value;
    const enteredPassword = passwordInputRef.current?.value;

    const loginData = {
      email: enteredEmail,
      password: enteredPassword,
    };

    const response = await fetch(`http://127.0.0.1:3000/api/v1/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
      return;
    }

    setError("");

    const profileData = await api
      .get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })
      .then((data) => data.data);

    localStorage.setItem("profileData", JSON.stringify(profileData));

    Cookies.set("token", data.access_token);

    window.location.href = "/patients";
  };

  return (
    <main className={styles.content}>
      <div className={styles.imgBx}>
        <img src="/logo.svg" alt="logo" />
      </div>
      <h1>
        Welcome to <br /> Health <span>Care</span>
      </h1>
      <form className={styles.form} onSubmit={submitHandler}>
        <div className={styles.errorBx}>
          {error.length > 0 && (
            <p className={styles.error}>
              Email ou senha estão errados. <br /> Tente novamente
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="email">E-mail</label>
          <div>
            <img src="/icons/email.svg" alt="email_icon" />
            <input
              ref={emailInputRef}
              placeholder="Digite seu e-mail"
              id="email"
              type="email"
            />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Senha</label>
          <div>
            <img src="/icons/padlock.svg" alt="padlock_icon" />
            <input
              placeholder="Insira sua senha"
              id="password"
              type={show ? "text" : "password"}
              ref={passwordInputRef}
            />
            {show && <AiFillEyeInvisible size={25} onClick={togglePassword} />}
            {!show && <AiFillEye size={25} onClick={togglePassword} />}
          </div>
        </div>
        <div className={styles.actions}>
          <button type="submit">Entrar</button>
        </div>
      </form>
    </main>
  );
};

export async function getStaticProps() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  return {
    props: {
      BASE_URL,
    },
  };
}

export default Login;
