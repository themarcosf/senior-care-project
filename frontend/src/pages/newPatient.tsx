import { FC, FormEvent, useEffect, useRef, useState } from "react";

import Header from "@/components/Header/Header";

import { useRouter } from "next/router";

import styles from "@/styles/NewPatientPage.module.scss";
import Cookies from "js-cookie";

const NewPatientPage = () => {
  const route = useRouter();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const nationalIdInputRef = useRef<HTMLInputElement>(null);
  const icdCodeInputRef = useRef<HTMLInputElement>(null);

  const saveHandler = async (event: FormEvent) => {
    event.preventDefault();

    const token = Cookies.get("token");

    const enteredName = nameInputRef.current?.value;
    const enteredNationalId = nationalIdInputRef.current?.value;
    const enteredIcdCode = icdCodeInputRef.current?.value;

    const patientData = {
      patientFullName: enteredName,
      birthDate:
        "Tue Aug 09 2022 17:28:14 GMT-0300 (Horário Padrão de Brasília)",
      nationalId: enteredNationalId,
      icdCode: enteredIcdCode,
    };

    const response = await fetch(
      // `${process.env.NEXT_PUBLIC_API_URL}/med-record`,
      `http://127.0.0.1:3000/api/v1/med-record`,
      {
        method: "POST",
        body: JSON.stringify(patientData),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await response.json();

    // console.log(data)

    route.push("/patients"); //Após a finalização do post, direcionar para uma nova evolução
  };

  return (
    <>
      <Header title="Cadastro do paciente" buttonName="" link="" />
      <nav className={styles.nav}>
        <ul>
          <li className={styles.active}>
            <button>
              <img src="/icons/info.svg" alt="info_icon" />
              <p>Cadastro</p>
            </button>
          </li>
        </ul>
      </nav>

      <main className={styles.main}>
        <div className={styles.formsHeader}>
          <h1> Cadastro do paciente </h1>
          <button form="registerForm">Salvar</button>
        </div>

        <form className={styles.form} id="registerForm" onSubmit={saveHandler}>
          <div className={styles.smallFields}>
            <div className={styles.fieldBlocks}>
              <div className={styles.field}>
                <label htmlFor="name">Nome Completo</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Digite aqui..."
                  ref={nameInputRef}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="patientDocument">RG</label>
                <input
                  type="text"
                  name="patientDocument"
                  id="patientDocument"
                  placeholder="Digite aqui..."
                  ref={nationalIdInputRef}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="date">CID</label>
                <input
                  type="text"
                  name="date"
                  id="date"
                  placeholder="Digite aqui..."
                  ref={icdCodeInputRef}
                />
              </div>
            </div>

            <div className={styles.fieldBlocks}>
              <div className={styles.field}>
                <label htmlFor="legalResponsible">Responsável Legal</label>
                <input
                  type="text"
                  name="legalResponsible"
                  id="legalResponsible"
                  placeholder="Digite aqui..."
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="responsibleDocument">RG do Responsável</label>
                <input
                  type="text"
                  name="responsibleDocument"
                  id="responsibleDocument"
                  placeholder="Digite aqui..."
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="tel">Tel para contato</label>
                <input
                  type="tel"
                  name="tel"
                  id="tel"
                  placeholder="Digite aqui..."
                />
              </div>
            </div>

            <div className={styles.fieldBlocks}>
              <div className={styles.field}>
                <label htmlFor="healthInsurance">Plano de saúde</label>
                <input
                  type="text"
                  name="healthInsurance"
                  id="healthInsurance"
                  placeholder="Digite aqui..."
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="healthInsuranceNumber">Nº do Plano</label>
                <input
                  type="text"
                  name="healthInsuranceNumber"
                  id="healthInsuranceNumber"
                  placeholder="Digite aqui..."
                />
              </div>
            </div>
          </div>
          <div className={`${styles.field} ${styles.descriptionfield}`}>
            <label htmlFor="comments">Observações</label>
            <textarea
              name="comments"
              id="comments"
              placeholder="Digite aqui..."
            ></textarea>
          </div>
        </form>
      </main>
    </>
  );
};

export default NewPatientPage;
