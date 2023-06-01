import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { TailSpin } from "react-loader-spinner";

import Header from "@/components/Header/Header";
import api from "@/services/api";
import useInput from "@/hooks/useInput";

import { progressionType } from "../newEvolution/[patientId]";

import styles from "@/styles/editEvolutionPage.module.scss";

const NewEvolutionPage: FC<{
  progressionId: number;
  progressionTypes: progressionType[];
}> = ({ progressionId }) => {
  const [navPosition, setNavPosition] = useState(1);
  const [formIsValid, setFormIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const diagnosisInputRef = useRef<HTMLTextAreaElement>(null);

  const route = useRouter();

  const {
    value: enteredDiagnosis,
    isValid: diagnosisIsValid,
    hasError: diagnosisInputHasError,
    inputChangeHandler: diagnosisChangeHandler,
    inputBlurHandler: diagnosisBlurHandler,
    reset: resetDiagnosis,
  } = useInput((value) => value.trim() !== "");

  useEffect(() => {
    if (!formIsValid && diagnosisIsValid) {
      setFormIsValid(true);
    } else if (formIsValid && !diagnosisIsValid) {
      setFormIsValid(false);
    }
  }, [formIsValid, diagnosisIsValid]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    if (!formIsValid) {
      return;
    }

    const enteredDiagnosis = diagnosisInputRef.current?.value;

    const formData = {
      diagnosis: enteredDiagnosis,
    };

    await api.patch(`/med-progression/${progressionId}`, formData);

    resetDiagnosis();

    route.push("/patients");
  };

  return (
    <>
      <Header title="Editar Evolução" buttonName="" link="" />
      <nav className={styles.nav}>
        <ul>
          <li className={navPosition === 1 ? styles.active : styles.inactive}>
            <button onClick={() => setNavPosition(1)}>
              <img src="/icons/clipboard.svg" alt="clipboard_icon" />
              <p>Evolução</p>
            </button>
          </li>
        </ul>
      </nav>
      <main className={styles.main}>
        <div className={styles.formsHeader}>
          <h1>Edite a evolução</h1>
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
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <div className={`${styles.field} ${styles.descriptionfield}`}>
              <label htmlFor="diagnosis">Diagnose</label>
              <textarea
                ref={diagnosisInputRef}
                name="diagnosis"
                id="diagnosis"
                placeholder="Insira os detalhes da evolução aqui..."
                value={enteredDiagnosis}
                onChange={diagnosisChangeHandler}
                onBlur={diagnosisBlurHandler}
              ></textarea>
              {diagnosisInputHasError && (
                <p className="error-text">Diagnose não deve estar vazio.</p>
              )}
            </div>

            <button
              className={styles.submitBtn}
              type="submit"
              disabled={!formIsValid}
              style={{ backgroundColor: formIsValid ? "#13a060" : "" }}
            >
              Salvar
            </button>
          </form>
        )}
      </main>
    </>
  );
};

interface Params extends ParsedUrlQuery {
  progressionId: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;

  const token = req.cookies["token"];

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { progressionId } = context.params as Params;

  const typesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/progression-type`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const progressionTypes = await typesResponse.json();

  return {
    props: {
      progressionId,
      progressionTypes,
    },
  };
};

export default NewEvolutionPage;
