import { FC } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";

import Card from "@/components/Card/Card";
import CardsList from "@/components/CardsList/CardsList";
import Header from "@/components/Header/Header";

import { patient } from "../../../models/patient";

const PatientPage: FC<{ patientData: patient }> = (props) => {
  const { id, name, evolutions } = props.patientData;

  return (
    <>
      <Header
        title={name}
        buttonName="Nova Evolução"
        link={`/newEvolution/${id}`}
      />
      <CardsList>
        {evolutions.map((evolution) => (
          <Card
            key={evolution.id}
            title={evolution.professionalName}
            subtitle={evolution.professionalArea}
            id={evolution.id}
          />
        ))}
      </CardsList>
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

export default PatientPage;
