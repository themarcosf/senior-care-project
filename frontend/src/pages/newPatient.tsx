import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FormEvent, useState, useEffect } from "react";
import InputMask from "react-input-mask";

import api from "@/services/api";
import useInput from "@/hooks/useInput";

import Header from "@/components/Header/Header";

import { TailSpin } from "react-loader-spinner";

import styles from "@/styles/newPatientPage.module.scss";

const NewPatientPage = () => {
  const route = useRouter();
  const [formIsValid, setFormIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    value: enteredPatientName,
    isValid: patientNameIsValid,
    hasError: patientNameInputHasError,
    inputChangeHandler: patientNameChangeHandler,
    inputBlurHandler: patientNameBlurHandler,
    reset: resetPatientName,
    submitInputHandler: submitPatientNameHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredPatientNationalId,
    isValid: patientNationalIdIsValid,
    hasError: patientNationalIdInputHasError,
    inputChangeHandler: patientNationalIdChangeHandler,
    inputBlurHandler: patientNationalIdBlurHandler,
    reset: resetPatientNationalId,
    submitInputHandler: submitPatientNationalIdHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredIcdCode,
    isValid: icdCodeIsValid,
    hasError: icdCodeInputHasError,
    inputChangeHandler: icdCodeChangeHandler,
    inputBlurHandler: icdCodeBlurHandler,
    reset: resetIcdCode,
    submitInputHandler: submitIcdCodeHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredBirthDate,
    isValid: birthDateIsValid,
    hasError: birthDateInputHasError,
    inputChangeHandler: birthDateChangeHandler,
    inputBlurHandler: birthDateBlurHandler,
    reset: resetBirthDate,
    submitInputHandler: submitBirthDateHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredLegalGuardianName,
    isValid: legalGuardianNameIsValid,
    hasError: legalGuardianNameInputHasError,
    inputChangeHandler: legalGuardianNameChangeHandler,
    inputBlurHandler: legalGuardianNameBlurHandler,
    reset: resetLegalGuardianName,
    submitInputHandler: submitLegalGuardianNameHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredLegalGuardianNationalId,
    isValid: legalGuardianNationalIdIsValid,
    hasError: legalGuardianNationalIdInputHasError,
    inputChangeHandler: legalGuardianNationalIdChangeHandler,
    inputBlurHandler: legalGuardianNationalIdBlurHandler,
    reset: resetLegalGuardianNationalId,
    submitInputHandler: submitLegalGuardianNationalIdHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredLegalGuardianPhone,
    isValid: legalGuardianPhoneIsValid,
    hasError: legalGuardianPhoneInputHasError,
    inputChangeHandler: legalGuardianPhoneChangeHandler,
    inputBlurHandler: legalGuardianPhoneBlurHandler,
    reset: resetLegalGuardianPhone,
    submitInputHandler: submitLegalGuardianPhoneHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredLegalGuardianEmail,
    isValid: legalGuardianEmailIsValid,
    hasError: legalGuardianEmailInputHasError,
    inputChangeHandler: legalGuardianEmailChangeHandler,
    inputBlurHandler: legalGuardianEmailBlurHandler,
    reset: resetLegalGuardianEmail,
    submitInputHandler: submitLegalGuardianEmailHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredInsurancePlan,
    isValid: insurancePlanIsValid,
    hasError: insurancePlanInputHasError,
    inputChangeHandler: insurancePlanChangeHandler,
    inputBlurHandler: insurancePlanBlurHandler,
    reset: resetInsurancePlan,
    submitInputHandler: submitInsurancePlanHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredInsurancePolicyNumber,
    isValid: insurancePolicyNumberIsValid,
    hasError: insurancePolicyNumberInputHasError,
    inputChangeHandler: insurancePolicyNumberChangeHandler,
    inputBlurHandler: insurancePolicyNumberBlurHandler,
    reset: resetInsurancePolicyNumber,
    submitInputHandler: submitInsurancePolicyNumberHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredObservation,
    isValid: observationIsValid,
    hasError: observationInputHasError,
    inputChangeHandler: observationChangeHandler,
    inputBlurHandler: observationBlurHandler,
    reset: resetObservation,
    submitInputHandler: submitObservationHandler,
  } = useInput((value) => value.trim() !== "");

  const inputsSubmitHandler = () => {
    submitPatientNameHandler();
    submitPatientNationalIdHandler();
    submitIcdCodeHandler();
    submitBirthDateHandler();
    submitLegalGuardianNameHandler();
    submitLegalGuardianNationalIdHandler();
    submitLegalGuardianPhoneHandler();
    submitLegalGuardianEmailHandler();
    submitInsurancePlanHandler();
    submitInsurancePolicyNumberHandler();
    submitObservationHandler();
  };

  const resetInputsHandler = () => {
    resetPatientName();
    resetPatientNationalId();
    resetIcdCode();
    resetBirthDate();
    resetLegalGuardianName();
    resetLegalGuardianNationalId();
    resetLegalGuardianPhone();
    resetLegalGuardianEmail();
    resetInsurancePlan();
    resetInsurancePolicyNumber();
    resetObservation();
  };

  useEffect(() => {
    if (
      !formIsValid &&
      patientNameIsValid &&
      patientNationalIdIsValid &&
      icdCodeIsValid &&
      birthDateIsValid &&
      legalGuardianNameIsValid &&
      legalGuardianNationalIdIsValid &&
      legalGuardianPhoneIsValid &&
      legalGuardianEmailIsValid &&
      insurancePlanIsValid &&
      insurancePolicyNumberIsValid
    ) {
      setFormIsValid(true);
    } else if (
      formIsValid &&
      (!patientNameIsValid ||
        !patientNationalIdIsValid ||
        !icdCodeIsValid ||
        !birthDateIsValid ||
        !legalGuardianNameIsValid ||
        !legalGuardianNationalIdIsValid ||
        !legalGuardianPhoneIsValid ||
        !legalGuardianEmailIsValid ||
        !insurancePlanIsValid ||
        !insurancePolicyNumberIsValid)
    ) {
      setFormIsValid(false);
    }
  }, [
    formIsValid,
    patientNameIsValid,
    patientNationalIdIsValid,
    icdCodeIsValid,
    birthDateIsValid,
    legalGuardianNameIsValid,
    legalGuardianNationalIdIsValid,
    legalGuardianPhoneIsValid,
    legalGuardianEmailIsValid,
    insurancePlanIsValid,
    insurancePolicyNumberIsValid,
  ]);

  const saveHandler = async (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    console.log("saveHandler");
    // inputsSubmitHandler();

    if (!formIsValid) {
      return;
    }

    let formatedEnteredBirthDate;
    if (enteredBirthDate) {
      formatedEnteredBirthDate = new Date(enteredBirthDate);
    }

    const patientData = {
      patientFullName: enteredPatientName,
      birthDate: formatedEnteredBirthDate,
      nationalId: enteredPatientNationalId,
      icdCode: enteredIcdCode,
      legalGuardian: enteredLegalGuardianName,
      legalGuardianIdNumber: enteredLegalGuardianNationalId,
      legalGuardianPhone: enteredLegalGuardianPhone,
      email: enteredLegalGuardianEmail,
      insurancePlan: enteredInsurancePlan,
      insurancePolicyNumber: enteredInsurancePolicyNumber,
      observation: enteredObservation,
    };

    await api.post(`/med-record`, patientData);

    route.push("/patients"); //Após a   finalização do post, direcionar para uma nova evolução

    resetInputsHandler();
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
          <h1>Cadastro do paciente</h1>
          <button
            style={{ backgroundColor: formIsValid ? "#13a060" : "" }}
            form="registerForm"
            disabled={!formIsValid}
          >
            Cadastrar
          </button>
        </div>

        {isLoading && (
          <div className={styles.spinnerContainer}>
            <TailSpin
              height="80"
              width="80"
              color="var(--neutral-400)"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        )}
        {!isLoading && (
          <form
            className={styles.form}
            id="registerForm"
            onSubmit={saveHandler}
          >
            <div className={styles.smallFields}>
              <div className={styles.fieldBlocks}>
                <div className={styles.field}>
                  <label htmlFor="name">Nome Completo</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Digite aqui..."
                    value={enteredPatientName}
                    onChange={patientNameChangeHandler}
                    onBlur={patientNameBlurHandler}
                  />
                  {patientNameInputHasError && (
                    <p className="error-text">Nome não deve estar vazio.</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label htmlFor="patientPatientNationalId">CPF</label>
                  <InputMask
                    id="patientPatientNationalId"
                    mask="999.999.999-99"
                    placeholder="Digite aqui..."
                    value={enteredPatientNationalId}
                    onChange={patientNationalIdChangeHandler}
                    onBlur={patientNationalIdBlurHandler}
                  />
                  {patientNationalIdInputHasError && (
                    <p className="error-text">CPF não deve estar vazio.</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label htmlFor="ICD">CID</label>
                  <input
                    type="text"
                    name="ICD"
                    id="ICD"
                    placeholder="Digite aqui..."
                    value={enteredIcdCode}
                    onChange={icdCodeChangeHandler}
                    onBlur={icdCodeBlurHandler}
                  />
                  {icdCodeInputHasError && (
                    <p className="error-text">CID não deve estar vazio.</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label htmlFor="birthDate">Data de nascimento</label>
                  <input
                    type="date"
                    name="birthDate"
                    id="birthDate"
                    value={enteredBirthDate}
                    onChange={birthDateChangeHandler}
                    onBlur={birthDateBlurHandler}
                  />
                  {birthDateInputHasError && (
                    <p className="error-text">
                      Data de nascimento não deve estar vazio.
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.fieldBlocks}>
                <div className={styles.field}>
                  <label htmlFor="legalGuardian">Responsável Legal</label>
                  <input
                    type="text"
                    name="legalGuardian"
                    id="legalGuardian"
                    placeholder="Digite aqui..."
                    value={enteredLegalGuardianName}
                    onChange={legalGuardianNameChangeHandler}
                    onBlur={legalGuardianNameBlurHandler}
                  />
                  {legalGuardianNameInputHasError && (
                    <p className="error-text">
                      Responsável não deve estar vazio.
                    </p>
                  )}
                </div>
                <div className={styles.field}>
                  <label htmlFor="legalGuardianNationalId">
                    CPF do Responsável
                  </label>
                  <InputMask
                    id="legalGuardianNationalId"
                    mask="999.999.999-99"
                    placeholder="Digite aqui..."
                    value={enteredLegalGuardianNationalId}
                    onChange={legalGuardianNationalIdChangeHandler}
                    onBlur={legalGuardianNationalIdBlurHandler}
                  />
                  {legalGuardianNationalIdInputHasError && (
                    <p className="error-text">
                      CPF do responsável legal não deve estar vazio.
                    </p>
                  )}
                </div>
                <div className={styles.field}>
                  <label htmlFor="legalGuardianPhone">Tel para contato</label>
                  <InputMask
                    type="tel"
                    id="legalGuardianPhone"
                    mask="(99) 99999-9999"
                    placeholder="Digite aqui..."
                    value={enteredLegalGuardianPhone}
                    onChange={legalGuardianPhoneChangeHandler}
                    onBlur={legalGuardianPhoneBlurHandler}
                  />
                  {legalGuardianPhoneInputHasError && (
                    <p className="error-text">Telefone não deve estar vazio.</p>
                  )}
                </div>
                <div className={styles.field}>
                  <label htmlFor="legalGuardianEmail">Email para contato</label>
                  <input
                    type="email"
                    name="legalGuardianEmail"
                    id="legalGuardianEmail"
                    placeholder="Digite aqui..."
                    value={enteredLegalGuardianEmail}
                    onChange={legalGuardianEmailChangeHandler}
                    onBlur={legalGuardianEmailBlurHandler}
                  />
                  {legalGuardianEmailInputHasError && (
                    <p className="error-text">Email não deve estar vazio.</p>
                  )}
                </div>
              </div>

              <div className={styles.fieldBlocks}>
                <div className={styles.field}>
                  <label htmlFor="insurancePlan">Plano de saúde</label>
                  <input
                    type="text"
                    name="insurancePlan"
                    id="insurancePlan"
                    placeholder="Digite aqui..."
                    value={enteredInsurancePlan}
                    onChange={insurancePlanChangeHandler}
                    onBlur={insurancePlanBlurHandler}
                  />
                  {insurancePlanInputHasError && (
                    <p className="error-text">
                      Plano de Saúde não deve estar vazio.
                    </p>
                  )}
                </div>
                <div className={styles.field}>
                  <label htmlFor="insurancePolicyNumber">Nº do Plano</label>
                  <input
                    type="text"
                    name="insurancePolicyNumber"
                    id="insurancePolicyNumber"
                    placeholder="Digite aqui..."
                    value={enteredInsurancePolicyNumber}
                    onChange={insurancePolicyNumberChangeHandler}
                    onBlur={insurancePolicyNumberBlurHandler}
                  />
                  {insurancePolicyNumberInputHasError && (
                    <p className="error-text">
                      Nº do Plano não deve estar vazio.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className={`${styles.field} ${styles.descriptionfield}`}>
              <label htmlFor="observation">Observações</label>
              <textarea
                name="observation"
                id="observation"
                placeholder="Digite aqui..."
                value={enteredObservation}
                onChange={observationChangeHandler}
                onBlur={observationBlurHandler}
              ></textarea>
            </div>
          </form>
        )}
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
