import { FC } from "react";

import Link from "next/link";

import styles from "./HomeCard.module.scss";

const HomeCard: FC<{
  id: number;
  patientFullName: string;
  lastProgression: string;
}> = (props) => {
  const { id, patientFullName, lastProgression } = props;

  const readableDate = new Date(lastProgression).toLocaleDateString("pt-BR");

  return (
    <div className={styles.container}>
      <h1>{patientFullName}</h1>
      <p>
        {!lastProgression
          ? "Sem evoluções"
          : `Última Evolução: ${readableDate}`}
      </p>
      <div className={styles.actions}>
        <Link href={`/patients/${patientFullName}`}>Histórico</Link>
        <Link href={`/newEvolution/${patientFullName}`}>Nova Evolução</Link>
      </div>
    </div>
  );
};

export default HomeCard;
