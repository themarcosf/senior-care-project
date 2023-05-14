import { FC, FormEvent, useEffect, useRef, useState } from "react";

import Header from "@/components/Header/Header";

import { patient } from "../../models/patient";

import { useRouter } from "next/router";

import styles from "@/styles/NewPatientPage.module.scss";

const NewPatientPage = () => {
  const route = useRouter();

  const saveHandler = (event: FormEvent) => {
    event.preventDefault();

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
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="patientDocument">RG</label>
                <input
                  type="text"
                  name="patientDocument"
                  id="patientDocument"
                  placeholder="Digite aqui..."
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="date">CID</label>
                <input
                  type="text"
                  name="date"
                  id="date"
                  placeholder="Digite aqui..."
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
