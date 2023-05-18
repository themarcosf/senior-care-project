import { FC } from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";

import PatientCard from "@/components/PatientCard/PatientCard";
import CardsList from "@/components/CardsList/CardsList";
import Header from "@/components/Header/Header";

import { patientCard } from "@/models/patientCard";

import styles from "@/styles/progressionDetail.module.scss";

type progressionData = {
  physicians: string;
  diagnosis: string;
  createdAt: string;
  medicalTests: string[];
};

const PatientPage: FC<{
  progressionData: progressionData;
  patientName: string;
}> = ({ progressionData, patientName }) => {
  const { physicians, diagnosis, createdAt, medicalTests } = progressionData;

  const readableDate = new Date(createdAt).toLocaleDateString("pt-BR");

  console.log(progressionData);

  return (
    <>
      <Header title={patientName} buttonName="Nova Evolução" link="" />
      <CardsList>
        <div className={styles.detailsContainer}>
        <h1>Detalhes da Evolução</h1>
          <p>
            <b>Autor da evolução:</b> {physicians}
          </p>
          <p>
            <b>Data da evolução:</b> {readableDate}
          </p>
          <p>
            <b>Diagnóstico:</b> {diagnosis}
          </p>

          <h2>Arquivos da evolução</h2>
          {medicalTests && medicalTests.map((test) => <p key={test}>{test}</p>)}
        </div>
      </CardsList>
    </>
  );
};

interface Params extends ParsedUrlQuery {
  patientId: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const token = req.cookies["token"];
  const progressionId = context.query.progressionId;
  let progressionData;
  let patientData;

  if (progressionId) {
    const patientResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/med-record/patient?fullName=${progressionId[0]}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    patientData = await patientResponse.json();

    const progressionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/med-progression/${progressionId[1]}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    progressionData = await progressionResponse.json();
  }

  const patientName = patientData.patientFullName;

  return {
    props: {
      progressionData,
      patientName,
    },
  };
};

export default PatientPage;
