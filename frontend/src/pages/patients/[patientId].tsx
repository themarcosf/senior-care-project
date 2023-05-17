import { FC } from "react";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";

import PatientCard from "@/components/PatientCard/PatientCard";
import CardsList from "@/components/CardsList/CardsList";
import Header from "@/components/Header/Header";

import { patientCard } from "../../../models/patientCard";

const PatientPage: FC<{ patientData: patientCard }> = (props) => {
  const { id, patientFullName, __progressions__ } = props.patientData;

  // console.log(props.patientData)

  return (
    <>
      <Header
        title={patientFullName}
        buttonName="Nova Evolução"
        link={`/newEvolution/${id}`}
      />
      <CardsList>
        {__progressions__.map((progression) => (
          <PatientCard
            key={progression.id}
            physician={progression.physicians}
            physicianArea={progression.physiciansArea}
            id={progression.id}
          />
        ))}
        {/* Abrir modal com detalhes da progression */}
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

  const { patientId } = context.params as Params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/med-record/patient?fullName=${patientId}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  const data = await response.json();

  return {
    props: {
      patientData: data,
    },
  };
};

export default PatientPage;
