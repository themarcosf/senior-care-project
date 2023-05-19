import { FC, use, useEffect, useState } from "react";
import { GetServerSideProps } from "next";

import Header from "@/components/Header/Header";
import Search from "@/components/Search/Search";
import CardsList from "@/components/CardsList/CardsList";
import HomeCard from "@/components/HomeCard/HomeCard";

import { homeCard } from "../../models/homeCard";

const HomePage: FC<{ homeData: homeCard[] }> = ({ homeData }) => {
  const [search, setSearch] = useState("");

  let role;
  const profileData = localStorage.getItem("profileData");

  if (profileData !== null) {
    role = JSON.parse(profileData).role;
  }

  const filteredData =
    search.length > 0
      ? homeData.filter((card) =>
          card.patientFullName.toLowerCase().includes(search.toLowerCase())
        )
      : homeData;

  return (
    <>
      <Header
        title="Pacientes"
        buttonName="Adicionar Paciente"
        link={role === "physician" ? "/newPatient" : ""}
      />
      <Search search={search} onSearch={setSearch} />
      <CardsList>
        {filteredData.length !== 0 && filteredData ? (
          filteredData.map((card) => (
            <HomeCard
              key={card.id}
              id={card.id}
              patientFullName={card.patientFullName}
              lastProgression={card.lastProgression}
            />
          ))
        ) : (
          <h1>Nenhum paciente encontrado</h1>
        )}
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
