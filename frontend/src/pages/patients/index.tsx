import { FC, useEffect, useState } from "react";
import { GetServerSideProps } from "next";

import Header from "@/components/Header/Header";
import Search from "@/components/Search/Search";
import CardsList from "@/components/CardsList/CardsList";
import HomeCard from "@/components/HomeCard/HomeCard";
import Placeholder from "@/components/Placeholder/Placeholder";

import { homeCard } from "../../models/homeCard";

const HomePage: FC<{ homeData: homeCard[] }> = ({ homeData }) => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const profileData = localStorage.getItem("profileData");

    if (profileData !== null) {
      setRole(JSON.parse(profileData).role);
    }
  }, []);

  const filteredData =
    search.length > 0
      ? homeData.filter((card) =>
          card.patientFullName.toLowerCase().includes(search.toLowerCase())
        )
      : homeData;

  const contentSize = filteredData.length;

  return (
    <>
      <Header
        title="Pacientes"
        buttonName="Adicionar Paciente"
        link={role === "physician" && contentSize >= 4 ? "/newPatient" : ""}
      />
      <Search
        search={search}
        onSearch={setSearch}
        placeholder="Digite o nome do paciente aqui"
      />
      <CardsList>
        {filteredData.length !== 0 &&
          filteredData &&
          filteredData.map((card) => (
            <HomeCard
              key={card.id}
              id={card.id}
              patientFullName={card.patientFullName}
              lastProgression={card.lastProgression}
            />
          ))}
        {contentSize < 4 && (
          <Placeholder
            contentSize={filteredData.length}
            text="Nenhum paciente encontrado"
            link="/newPatient"
            btnText="Adicionar paciente"
          />
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
