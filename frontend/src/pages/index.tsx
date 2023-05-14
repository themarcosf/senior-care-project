import { FormEvent } from "react";
import { useRouter } from "next/router";

import styles from "@/styles/login.module.scss";

export default function Login() {
  const router = useRouter();

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();

    router.push("/patients");
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
        <div className={styles.field}>
          <label htmlFor="email">E-mail</label>
          <div>
            <img src="/icons/email.svg" alt="email_icon" />
            <input placeholder="Digite seu e-mail" id="email" type="email" />
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
            />
          </div>
        </div>
        <div className={styles.actions}>
          <button type="submit">Entrar</button>
        </div>
      </form>
    </main>
  );
}
