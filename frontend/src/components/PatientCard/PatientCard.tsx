import { FC } from "react";

import Link from "next/link";

import styles from "./PatientCard.module.scss";

const PatientCard: FC<{
  progressionId: number;
  physician: string;
  physicianArea: string;
  patientFullName: string;
}> = (props) => {
  const { progressionId, physician, physicianArea, patientFullName } = props;

  return (
    <div className={styles.container}>
      <h1>{physician}</h1>
      <p>
        {physicianArea === undefined
          ? "Sem area"
          : `${physicianArea}`}
      </p>
      <div className={styles.actions}>
          <Link href={`${patientFullName}/${progressionId.toString()}`}>Mais detalhes</Link>
      </div>
    </div>
  );
};

export default PatientCard;
