import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

import Header from "@/components/Header/Header";

import { patient } from "../../../models/patient";

import styles from "@/styles/newEvolutionPage.module.scss";

const NewEvolutionPage: FC<{ patientData: patient }> = (props) => {
  const [navPostion, setNavPostion] = useState(1);
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const inputFileRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const route = useRouter();

  useEffect(() => {
    const now = new Date();
    const nowDate = now.toLocaleDateString();
    const nowHour = [now.getHours(), now.getMinutes()].join(":");

    setDate(nowDate);
    setHour(nowHour);
  }, []);

  const { id, name, evolutions } = props.patientData;

  const evolutionNumber = evolutions.reverse()[0].id + 1;

  const saveHandler = (event: FormEvent) => {
    event.preventDefault();

    if (navPostion === 1) {
      const enteredDescription = descriptionInputRef.current?.value;

      const evolutionData = {
        name: "Carlos Abreu",
        credential: "16H1AZ42",
        date: date,
        hour: hour,
        expertise: "Fisioterapeuta",
        evolutionNumber: evolutionNumber,
        description: enteredDescription,
      };

      console.log("POST: ", evolutionData);
    }

    if (navPostion < 3) {
      setNavPostion((prevState) => {
        return prevState + 1;
      });
    } else {
      route.push("/patients");
    }
  };

  return (
    <>
      <Header title={name} buttonName="Histórico" link={`/patients/${id}`} />
      <nav className={styles.nav}>
        <ul>
          <li className={navPostion === 1 ? styles.active : styles.inactive}>
            <button onClick={() => setNavPostion(1)}>
              <img src="/icons/clipboard.svg" alt="clipboard_icon" />
              <p>Evolução</p>
            </button>
          </li>
          <li className={navPostion === 2 ? styles.active : styles.inactive}>
            <button onClick={() => setNavPostion(2)}>
              <img src="/icons/pharmacy.svg" alt="pharmacy_icon" />
              <p>Farmácia</p>
            </button>
          </li>
          <li className={navPostion === 3 ? styles.active : styles.inactive}>
            <button onClick={() => setNavPostion(3)}>
              <img src="/icons/clip.svg" alt="clip_icon" />
              <p>Anexar</p>
            </button>
          </li>
        </ul>
      </nav>
      <main
        className={`
        ${styles.main}
        ${navPostion === 1 && styles.noBorderLeft}
        ${navPostion === 3 && styles.noBorderRight}
        `}
      >
        <div className={styles.formsHeader}>
          <h1>
            {navPostion === 1 && "Evolução"}
            {navPostion === 2 && "Farmácia"}
            {navPostion === 3 && "Anexar"}
          </h1>
          <button onClick={saveHandler} form="evolutionForm">
            Salvar
          </button>
        </div>

        {navPostion === 1 && (
          <form
            className={styles.form}
            onSubmit={saveHandler}
            id="evolutionForm"
          >
            <div className={styles.disabledFields}>
              <div className={styles.field}>
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  disabled
                  placeholder="Carlos Abreu" //Placeholder from loginData
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="credential">Credencial</label>
                <input
                  type="text"
                  name="credential"
                  id="credential"
                  disabled
                  placeholder="16H1AZ42" //Placeholder from loginData
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="date">Data</label>
                <input
                  type="text"
                  name="date"
                  id="date"
                  disabled
                  placeholder={date}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="hour">Hora</label>
                <input
                  type="text"
                  name="hour"
                  id="hour"
                  disabled
                  placeholder={hour}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="expertise">Especialidade</label>
                <input
                  type="text"
                  name="expertise"
                  id="expertise"
                  disabled
                  placeholder="Fisioterapeuta" //Placeholder from loginData
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="evolutionNumber">Nº da Evolução</label>
                <input
                  type="text"
                  name="evolutionNumber"
                  id="evolutionNumber"
                  disabled
                  placeholder={`${evolutionNumber}ª`} //Placeholder from loginData
                />
              </div>
            </div>
            <div className={`${styles.field} ${styles.descriptionfield}`}>
              <label htmlFor="description">Descrição</label>
              <textarea
                ref={descriptionInputRef}
                name="description"
                id="description"
                placeholder="Insira os detalhes da evolução aqui..."
              ></textarea>
            </div>
          </form>
        )}

        {navPostion === 3 && (
          <div className={styles.attachContainer}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a
              nulla fermentum est commodo laoreet. Donec rutrum accumsan
              dignissim. Nunc varius faucibus dolor ac placerat. Mauris semper
              erat quis magna ultricies, egestas consectetur lectus dignissim.
            </p>
            <div className={styles.inputFileContainer}>
              <input
                ref={inputFileRef}
                type="file"
                name="file"
                id="file"
                multiple
              />
              <button onClick={() => inputFileRef.current?.click()}>
                Faça upload
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch("http:localhost:3000/patient.json");
  const data = await response.json();

  const paths = data.patients.map((patient: patient) => {
    return {
      params: {
        patientId: patient.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

interface Params extends ParsedUrlQuery {
  patientId: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { patientId } = context.params as Params;

  const response = await fetch("http:localhost:3000/patient.json");
  const data = await response.json();

  const patientData = data.patients.find(
    (patient: patient) => patient.id === +patientId
  );

  return {
    props: {
      patientData: patientData,
    },
  };
};

export default NewEvolutionPage;
