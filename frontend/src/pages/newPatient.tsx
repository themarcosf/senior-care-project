import { FC, FormEvent, useEffect, useRef, useState } from "react";

import Header from "@/components/Header/Header";

import { useRouter } from "next/router";

import styles from "@/styles/NewPatientPage.module.scss";
import Cookies from "js-cookie";
import api from "@/services/api";
import { GetServerSideProps } from "next";

const NewPatientPage = () => {
  const route = useRouter();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const nationalIdInputRef = useRef<HTMLInputElement>(null);
  const icdCodeInputRef = useRef<HTMLInputElement>(null);
  const birthDateInputRef = useRef<HTMLInputElement>(null);
  const legalGuardianInputRef = useRef<HTMLInputElement>(null);
  const legalGuardianIdNumberInputRef = useRef<HTMLInputElement>(null);
  const legalGuardianPhoneInputRef = useRef<HTMLInputElement>(null);
  const legalGuardianEmailInputRef = useRef<HTMLInputElement>(null);
  const insurancePlanInputRef = useRef<HTMLInputElement>(null);
  const insurancePolicyNumberInputRef = useRef<HTMLInputElement>(null);
  const observationInputRef = useRef<HTMLTextAreaElement>(null);

  const saveHandler = async (event: FormEvent) => {
    event.preventDefault();

    let enteredBirthDate;
    if (birthDateInputRef.current?.value) {
      enteredBirthDate = new Date(birthDateInputRef.current?.value);
    }
    const enteredName = nameInputRef.current?.value;
    const enteredNationalId = nationalIdInputRef.current?.value;
    const enteredIcdCode = icdCodeInputRef.current?.value;
    const enteredLegalGuardian = legalGuardianInputRef.current?.value;
    const enteredLegalGuardianIdNumber =
      legalGuardianIdNumberInputRef.current?.value;
    const enteredLegalGuardianPhone = legalGuardianPhoneInputRef.current?.value;
    const enteredLegalGuardianEmail = legalGuardianEmailInputRef.current?.value;
    const enteredInsurancePlan = insurancePlanInputRef.current?.value;
    const enteredInsurancePolicyNumber =
      insurancePolicyNumberInputRef.current?.value;
    const enteredObservation = observationInputRef.current?.value;

    const patientData = {
      patientFullName: enteredName,
      birthDate: enteredBirthDate,
      nationalId: enteredNationalId,
      icdCode: enteredIcdCode,
      email: enteredLegalGuardianEmail,
      legalGuardian: enteredLegalGuardian,
      legalGuardianIdNumber: enteredLegalGuardianIdNumber,
      legalGuardianPhone: enteredLegalGuardianPhone,
      insurancePlan: enteredInsurancePlan,
      insurancePolicyNumber: enteredInsurancePolicyNumber,
      observation: enteredObservation,
    };


    await api.post(`/med-record`, patientData);

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
              <p
                onClick={() => {
                  if (birthDateInputRef.current?.value) {
                    const date = new Date(birthDateInputRef.current?.value);
                  }
                }}
              >
                Cadastro
              </p>
            </button>
          </li>
        </ul>
      </nav>

      <main className={styles.main}>
        <div className={styles.formsHeader}>
          <h1> Cadastro do paciente </h1>
          <button form="registerForm">Cadastrar</button>
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
                <label htmlFor="CID">CID</label>
                <input
                  type="text"
                  name="CID"
                  id="CID"
                  placeholder="Digite aqui..."
                  ref={icdCodeInputRef}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="birthDate">Data de nascimento</label>
                <input
                  type="date"
                  name="birthDate"
                  id="birthDate"
                  ref={birthDateInputRef}
                />
              </div>
            </div>

            <div className={styles.fieldBlocks}>
              <div className={styles.field}>
                <label htmlFor="legalGuardian">Responsável Legal</label>
                <input
                  ref={legalGuardianInputRef}
                  type="text"
                  name="legalGuardian"
                  id="legalGuardian"
                  placeholder="Digite aqui..."
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="legalGuardianIdNumber">RG do Responsável</label>
                <input
                  ref={legalGuardianIdNumberInputRef}
                  type="text"
                  name="legalGuardianIdNumber"
                  id="legalGuardianIdNumber"
                  placeholder="Digite aqui..."
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="legalGuardianPhone">Tel para contato</label>
                <input
                  ref={legalGuardianPhoneInputRef}
                  type="tel"
                  name="legalGuardianPhone"
                  id="legalGuardianPhone"
                  placeholder="Digite aqui..."
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="legalGuardianEmail">Email para contato</label>
                <input
                  ref={legalGuardianEmailInputRef}
                  type="email"
                  name="legalGuardianEmail"
                  id="legalGuardianEmail"
                  placeholder="Digite aqui..."
                />
              </div>
            </div>

            <div className={styles.fieldBlocks}>
              <div className={styles.field}>
                <label htmlFor="insurancePlan">Plano de saúde</label>
                <input
                  ref={insurancePlanInputRef}
                  type="text"
                  name="insurancePlan"
                  id="insurancePlan"
                  placeholder="Digite aqui..."
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="insurancePolicyNumber">Nº do Plano</label>
                <input
                  ref={insurancePolicyNumberInputRef}
                  type="text"
                  name="insurancePolicyNumber"
                  id="insurancePolicyNumber"
                  placeholder="Digite aqui..."
                />
              </div>
            </div>
          </div>
          <div className={`${styles.field} ${styles.descriptionfield}`}>
            <label htmlFor="observation">Observações</label>
            <textarea
              ref={observationInputRef}
              name="observation"
              id="observation"
              placeholder="Digite aqui..."
            ></textarea>
          </div>
        </form>
      </main>
    </>
  );
};

export default NewPatientPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const token = req.cookies["token"];

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};