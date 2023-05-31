import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { ParsedUrlQuery } from "querystring";

import Header from "@/components/Header/Header";

import { profile } from "../../models/profile";
import fileApi from "@/services/fileApi";

import styles from "@/styles/newEvolutionPage.module.scss";
import useInput from "@/hooks/useInput";
import useFileInput from "@/hooks/useFileInput";

type patientData = {
  medRecordId: number;
  patientFullName: string;
};

export type progressionType = {
  createdAt: string;
  createdByUserId: number;
  description: string;
  entityName: string;
  id: number;
  isActive: boolean;
  toggleStatus: boolean;
  updatedAt: string;
};

const NewEvolutionPage: FC<{
  patientData: patientData;
  progressionTypes: progressionType[];
}> = ({ patientData, progressionTypes }) => {
  const [navPosition, setNavPosition] = useState(1);

  const diagnosisInputRef = useRef<HTMLTextAreaElement>(null);
  const progressionTypeInputRef = useRef<HTMLSelectElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [role, setRole] = useState<null>(null);
  const [name, setName] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);

  const {
    value: enteredDiagnosis,
    isValid: diagnosisIsValid,
    hasError: diagnosisInputHasError,
    inputChangeHandler: diagnosisChangeHandler,
    inputBlurHandler: diagnosisBlurHandler,
    reset: resetDiagnosis,
    submitInputHandler: submitDiagnosisHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    selectedFile,
    isValid: fileIsValid,
    hasError: fileInputHasError,
    handleFileChange,
    inputBlurHandler: fileBlurHandler,
    reset: resetFile,
    submitInputHandler: submitFileHandler,
  } = useFileInput((value) => value !== null);


  const route = useRouter();

  const { patientFullName, medRecordId } = patientData;

  useEffect(() => {
    const profileData = localStorage.getItem("profileData");

    if (profileData !== null) {
      setRole(JSON.parse(profileData).role);
      setName(JSON.parse(profileData).name);
    }
  }, []);

  useEffect(() => {
    if (!formIsValid && diagnosisIsValid && fileIsValid) {
      setFormIsValid(true);
    } else if (formIsValid && (!diagnosisIsValid || !fileIsValid)) {
      setFormIsValid(false);
    }
  }, [formIsValid, diagnosisIsValid, fileIsValid]);


  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    submitDiagnosisHandler();
    submitFileHandler();

    if (!formIsValid) {
      return;
    }

    const enteredDiagnosis = diagnosisInputRef.current?.value;
    const enteredProgressionType = progressionTypeInputRef.current?.value;

    const formData = new FormData();

    if (selectedFile) {
      formData.append("diagnosis", enteredDiagnosis as string);
      formData.append("medicalTests", selectedFile);
      formData.append("professional", name as string);

      await fileApi
        .post(
          `/med-progression?medicalRecord=${medRecordId}&progressionType=${enteredProgressionType}`,
          formData
        )
        .then((data) => {
          console.log("Progression created successfully:", data);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });

      resetDiagnosis();
      resetFile();

      route.push("/patients");
    }
  };

  return (
    <>
      <Header
        title={patientFullName}
        buttonName="Histórico"
        link={`/patients/${patientFullName}`}
      />
      <nav className={styles.nav}>
        <ul>
          <li className={navPosition === 1 ? styles.active : styles.inactive}>
            <button onClick={() => setNavPosition(1)}>
              <img src="/icons/clipboard.svg" alt="clipboard_icon" />
              <p>Evolução</p>
            </button>
          </li>
          <li className={navPosition === 2 ? styles.active : styles.inactive}>
            <button onClick={() => setNavPosition(2)}>
              <img src="/icons/pharmacy.svg" alt="pharmacy_icon" />
              <p>Farmácia</p>
            </button>
          </li>
        </ul>
      </nav>
      <main
        className={`
        ${styles.main}
        ${navPosition === 1 && styles.noBorderLeft}
        ${navPosition === 2 && styles.noBorderRight}
        `}
      >
        <div className={styles.formsHeader}>
          <h1 onClick={() => console.log(selectedFile)}>
            {navPosition === 1 && "Evolução"}
            {navPosition === 2 && "Farmácia"}
          </h1>
        </div>

        {navPosition === 1 && (
          <>
            <form className={styles.form} onSubmit={handleFormSubmit}>
              <div className={styles.field}>
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
                      <option
                        key={progressionType.id}
                        value={progressionType.id}
                      >
                        {progressionType.description}
                      </option>
                    );
                  })}
                </select>
              </div>
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
                  <p className="error-text">Nome não deve estar vazio.</p>
                )}
              </div>
              <div className={styles.inputFileContainer}>
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
                {diagnosisInputHasError && (
                  <p className="error-text">File não deve estar vazio.</p>
                )}
              </div>
              <button
                style={{ backgroundColor: formIsValid ? "#13a060" : "" }}
                className={styles.submitBtn}
                type="submit"
              >
                Salvar
              </button>
            </form>
          </>
        )}

        {navPosition === 2 && (
          <>
            <div className={styles.pharmacyContainer}>
              <button
                className={styles.submitBtn}
                onClick={() => route.push("/patients")}
              >
                Salvar
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
};

interface Params extends ParsedUrlQuery {
  patientId: string;
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

  const { patientId } = context.params as Params;

  const patientResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/med-record/patient?fullName=${patientId}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const medRecordData = await patientResponse.json();

  const typesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/progression-type`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const progressionTypes = await typesResponse.json();

  const patientData = {
    medRecordId: medRecordData.id,
    patientFullName: medRecordData.patientFullName,
  };

  return {
    props: {
      patientData,
      progressionTypes,
    },
  };
};

export default NewEvolutionPage;
