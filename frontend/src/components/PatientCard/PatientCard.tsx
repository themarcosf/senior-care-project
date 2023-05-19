import { FC, useEffect, useState } from "react";

import Link from "next/link";

import styles from "./PatientCard.module.scss";

const PatientCard: FC<{
  progressionId: number;
  physician: string;
  physicianArea: string;
  patientFullName: string;
  progressionDate: number;
}> = (props) => {
  const {
    progressionId,
    physician,
    physicianArea,
    patientFullName,
    progressionDate,
  } = props;

  const [canEdit, setCanEdit] = useState(false);

  let dateNow = Math.floor(new Date().getTime() / 1000);

  useEffect(() => {
    if (dateNow - progressionDate < 86400) {
      setCanEdit(true);
    }
  }, [progressionDate]);

  return (
    <div className={styles.container}>
      <div className={styles.cardHeader}>
        <div>
          <h1>{physician}</h1>
          <p>{physicianArea === undefined ? "Sem area" : `${physicianArea}`}</p>
        </div>
        {canEdit && (
          <Link href={`/editEvolution/${progressionId.toString()}`}>
            <img src="/icons/edit.svg" alt="edit_icon" />
            <p>Editar</p>
          </Link>
        )}
      </div>

      <div className={styles.actions}>
        <Link href={`${patientFullName}/${progressionId.toString()}`}>
          Mais detalhes
        </Link>
      </div>
    </div>
  );
};

export default PatientCard;
