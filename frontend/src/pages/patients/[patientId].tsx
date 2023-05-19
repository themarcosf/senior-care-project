import { FC, useState } from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";

import PatientCard from "@/components/PatientCard/PatientCard";
import CardsList from "@/components/CardsList/CardsList";
import Header from "@/components/Header/Header";

import { patientCard } from "../../models/patientCard";

import styles from "@/styles/patientPage.module.scss";
import Search from "@/components/Search/Search";
import Placeholder from "@/components/Placeholder/Placeholder";

const PatientPage: FC<{ patientData: patientCard }> = ({ patientData }) => {
  const { id, patientFullName, __progressions__ } = patientData;

  const [search, setSearch] = useState("");

  const filteredData =
    search.length > 0
      ? __progressions__.filter((card) =>
          card.physicians.toLowerCase().includes(search.toLowerCase())
        )
      : __progressions__;

  const contentSize = filteredData.length;

  return (
    <>
      <Header
        title={patientFullName}
        buttonName="Nova Evolução"
        link={
          contentSize > 5 ? `/newEvolution/${patientFullName}` : ""
        }
      />
      <Search search={search} onSearch={setSearch} placeholder="Digite o nome do profissional aqui..."/>
      <CardsList>
        {filteredData.length !== 0 &&
          filteredData && (
          filteredData.map((progression) => (
            <PatientCard
              key={progression.id}
              physician={progression.physicians}
              physicianArea={progression.physiciansArea}
              progressionId={progression.id}
              patientFullName={patientFullName}
              progressionDate={1684585859}
            />
          ))
        )}
        {contentSize < 5 && (
          <Placeholder
            contentSize={filteredData.length}
            text={`Não há evoluções cadastradas
            ${search ? " por esse profissional" : " para este paciente"}`}
            link={`/newEvolution/${patientFullName}`}
            btnText="Nova Evolução"
          />
        )}
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

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

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
