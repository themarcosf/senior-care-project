import { FC } from "react";
import { GetServerSideProps } from "next";

import Header from "@/components/Header/Header";
import Search from "@/components/Search/Search";
import CardsList from "@/components/CardsList/CardsList";
import Card from "@/components/Card/Card";

import { patient } from "../../../models/patient";
import { cardProps } from "../../../models/cardProps";

const HomePage: FC<{ cardData: cardProps[] }> = ({ cardData }) => {
  return (
    <>
      <Header
        title="Pacientes"
        buttonName="Adicionar Paciente"
        link="/newPatient"
      />
      <Search />
      <CardsList>
        {cardData.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            subtitle={card.subtitle}
          />
        ))}
      </CardsList>
    </>
  );
};

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
  
  const response = await fetch("http:localhost:3001/patient.json");
  const data = await response.json();

  const cardData = data.patients.map((patient: patient) => {
    return {
      id: patient.id,
      title: patient.name,
      subtitle: patient.lastEvolution,
    };
  });

  return {
    props: {
      cardData: cardData,
    },
  };
};

export default HomePage;

// export async function getStaticProps() {
//   const response = await fetch("http:localhost:3001/patient.json");
//   const data = await response.json();

//   const cardData = data.patients.map((patient: patient) => {
//     return {
//       id: patient.id,
//       title: patient.name,
//       subtitle: patient.lastEvolution,
//     };
//   });

//   return {
//     props: {
//       cardData: cardData,
//     },
//   };
// }
