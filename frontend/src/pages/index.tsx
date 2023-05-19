import { FC, FormEvent, useRef } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import styles from "@/styles/login.module.scss";
import api from "@/services/api";

const Login: FC<{ BASE_URL: string }> = ({ BASE_URL }) => {
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current?.value;
    const enteredPassword = passwordInputRef.current?.value;

    const loginData = {
      email: enteredEmail,
      password: enteredPassword,
    };

    const response = await fetch(`${BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    // TODO: handle errors

    if (!response.ok) {
      return;
    }

    const profileData = await api
      .get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })
      .then((data) => data.data);

    localStorage.setItem("profileData", JSON.stringify(profileData));

    Cookies.set("token", data.access_token);
    router.push("/patients");
  };

  return (
    <main className={styles.content}>
      <div className={styles.imgBx} onClick={() => console.log(process.env)}>
        <img src="/logo.svg" alt="logo" />
      </div>
      <h1>
        Welcome to <br /> Health <span>Care</span>
      </h1>
      <form className={styles.form} onSubmit={submitHandler}>
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
              type="password"
              ref={passwordInputRef}
            />
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
