import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { AiFillEdit } from "react-icons/ai";

import styles from "./PatientCard.module.scss";

const PatientCard: FC<{
  progressionId: number;
  professional: string;
  physicianArea: string;
  patientFullName: string;
  progressionDate: string;
}> = (props) => {
  const {
    progressionId,
    professional,
    physicianArea,
    patientFullName,
    progressionDate,
  } = props;

  const [canEdit, setCanEdit] = useState(false);

  let dateNow = Math.floor(new Date().getTime() / 1000);
  let progressionDateUnix = Math.floor(new Date(progressionDate).getTime() / 1000);

  useEffect(() => {
    if (dateNow - progressionDateUnix < 86400) {
      setCanEdit(true);
    }
  }, [progressionDate]);

  return (
    <div className={styles.container}>
      <div className={styles.cardHeader}>
        <div>
          <h1>{professional}</h1>
          <p>{physicianArea === undefined ? "Sem area" : `${physicianArea}`}</p>
        </div>
        {canEdit && (
          <Link href={`/editEvolution/${progressionId.toString()}`}>
            <AiFillEdit size={24} />
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
