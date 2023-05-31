import { ChangeEvent, FC, FormEvent, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { ParsedUrlQuery } from "querystring";

import Header from "@/components/Header/Header";

import { profile } from "../../models/profile";

import styles from "@/styles/editEvolutionPage.module.scss";
import axios from "axios";
import api from "@/services/api";
import { progressionType } from "../newEvolution/[patientId]";

const NewEvolutionPage: FC<{
  progressionId: number;
  progressionTypes: progressionType[];
}> = ({ progressionId, progressionTypes }) => {
  const [navPosition, setNavPosition] = useState(1);

  const diagnosisInputRef = useRef<HTMLTextAreaElement>(null);
  const progressionTypeInputRef = useRef<HTMLSelectElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [role, setRole] = useState<null>(null);
  const [name, setName] = useState("");

  const route = useRouter();

  useEffect(() => {
    const profileData = localStorage.getItem("profileData");

    if (profileData !== null) {
      setRole(JSON.parse(profileData).role);
      setName(JSON.parse(profileData).name);
    }
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const enteredDiagnosis = diagnosisInputRef.current?.value;
    const enteredProgressionType = progressionTypeInputRef.current?.value;

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
