import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { ParsedUrlQuery } from "querystring";

import Header from "@/components/Header/Header";

import { profile } from "../../models/profile";

import styles from "@/styles/newEvolutionPage.module.scss";
import axios from "axios";
import api from "@/services/api";

type patientData = {
  medRecordId: number;
  patientFullName: string;
  evolutionNumber: number;
};

const NewEvolutionPage: FC<{
  patientData: patientData;
}> = (props) => {
  const [navPosition, setNavPosition] = useState(1);

  const diagnosisInputRef = useRef<HTMLTextAreaElement>(null);
  const progressionTypeInputRef = useRef<HTMLSelectElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const route = useRouter();

  const { patientFullName } = props.patientData;

  let role;
  const profileData = localStorage.getItem("profileData");

  if (profileData !== null) {
    role = JSON.parse(profileData).role;
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const dateNow = Math.floor(new Date().getTime() / 1000).toString();
    const enteredDiagnosis = diagnosisInputRef.current?.value;
    const enteredProgressionType = progressionTypeInputRef.current?.value;

    const formData = new FormData();

    // if (selectedFile) {
    //   formData.append("diagnosis", enteredDiagnosis as string);
    //   formData.append("medicalTests", selectedFile);
    //   // formData.append("date", dateNow as string);

    //   await api
    //     .post(`/med-progression?medicalRecord=${medRecordId}`, formData)
    //     .then((data) => {
    //       console.log("File uploaded successfully:", data);
    //     })
    //     .catch((error) => {
    //       console.error("Error uploading file:", error);
    //     });

    //   setNavPosition(2);

    //   // route.push("/patients");
    // }
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
          <h1>
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
                  <option value="type1">Tipo 1</option>
                  <option value="type2">Tipo 2</option>
                  <option value="type3">Tipo 3</option>
                  {role === "physician" && (
                    <option value="finishing">Encerrar prontuário</option>

                  )}
                </select>
              </div>
              <div className={`${styles.field} ${styles.descriptionfield}`}>
                <label htmlFor="diagnosis">Diagnose</label>
                <textarea
                  ref={diagnosisInputRef}
                  name="diagnosis"
                  id="diagnosis"
                  placeholder="Insira os detalhes da evolução aqui..."
                ></textarea>
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
              </div>
              <button className={styles.submitBtn} type="submit">
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

  const patientData = {
    medRecordId: medRecordData.id,
    patientFullName: medRecordData.patientFullName,
  };

  return {
    props: {
      patientData: patientData,
    },
  };
};

export default NewEvolutionPage;
