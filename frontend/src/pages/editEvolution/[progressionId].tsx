import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { ParsedUrlQuery } from "querystring";
import { TailSpin } from "react-loader-spinner";

import Header from "@/components/Header/Header";

import { profile } from "../../models/profile";

import styles from "@/styles/editEvolutionPage.module.scss";
import axios from "axios";
import api from "@/services/api";
import { progressionType } from "../newEvolution/[patientId]";
import useInput from "@/hooks/useInput";

const NewEvolutionPage: FC<{
  progressionId: number;
  progressionTypes: progressionType[];
}> = ({ progressionId, progressionTypes }) => {
  const [navPosition, setNavPosition] = useState(1);

  const diagnosisInputRef = useRef<HTMLTextAreaElement>(null);
  const progressionTypeInputRef = useRef<HTMLSelectElement>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [role, setRole] = useState<null>(null);
  const [name, setName] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    value: enteredDiagnosis,
    isValid: diagnosisIsValid,
    hasError: diagnosisInputHasError,
    inputChangeHandler: diagnosisChangeHandler,
    inputBlurHandler: diagnosisBlurHandler,
    reset: resetDiagnosis,
    submitInputHandler: submitDiagnosisHandler,
  } = useInput((value) => value.trim() !== "");

  const route = useRouter();

  useEffect(() => {
    const profileData = localStorage.getItem("profileData");

    if (profileData !== null) {
      setRole(JSON.parse(profileData).role);
      setName(JSON.parse(profileData).name);
    }
  }, []);

  useEffect(() => {
    if (!formIsValid && diagnosisIsValid) {
      setFormIsValid(true);
    } else if (formIsValid && !diagnosisIsValid) {
      setFormIsValid(false);
    }
  }, [formIsValid, diagnosisIsValid]);

  // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     setSelectedFile(event.target.files[0]);
  //   }
  // };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    if (!formIsValid) {
      return;
    }

    const enteredDiagnosis = diagnosisInputRef.current?.value;
    // const enteredProgressionType = progressionTypeInputRef.current?.value;

    const formData = {
      diagnosis: enteredDiagnosis,
    };

    await api
      .patch(`/med-progression/${progressionId}`, formData)
      .then((data) => {
        console.log("Progression edited successfully:", data);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });

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
            {/* <div className={styles.field}>
            <label htmlFor="progressionType">Tipo de progressão</label>
            <select
              name="progressionType"
              id="progressionType"
              ref={progressionTypeInputRef}
            >
              {progressionTypes.map((progressionType) => {
                if (
                  role !== "physician" &&
                  progressionType.description === "Alta"
                ) {
                  return;
                }

                return (
                  <option key={progressionType.id} value={progressionType.id}>
                    {progressionType.description}
                  </option>
                );
              })}
            </select>
          </div> */}

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
            </div>

            {/* <div className={styles.inputFileContainer}>
                <input
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  type="file"
                  name="file"
                  id="file"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Faça upload
                </button>
                {selectedFile && (
                  <p>
                    <span>Arquivo selecionado:</span> {selectedFile.name}
                  </p>
                )}
              </div> */}
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
