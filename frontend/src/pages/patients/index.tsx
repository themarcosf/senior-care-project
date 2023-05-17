import { FC } from "react";
import { GetServerSideProps } from "next";

import Header from "@/components/Header/Header";
import Search from "@/components/Search/Search";
import CardsList from "@/components/CardsList/CardsList";
import HomeCard from "@/components/HomeCard/HomeCard";

import { homeCard } from "../../../models/homeCard";

const HomePage: FC<{ homeData: homeCard[] }> = ({ homeData }) => {
  return (
    <>
      <Header
        title="Pacientes"
        buttonName="Adicionar Paciente"
        link="/newPatient"
      />
      <Search />
      <CardsList>
        {homeData.map((card) => (
          <HomeCard
            key={card.id}
            id={card.id}
            patientFullName={card.patientFullName}
            lastProgression={card.lastProgression}
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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/med-record`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  const data = await response.json();

  return {
    props: {
      homeData: data,
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
