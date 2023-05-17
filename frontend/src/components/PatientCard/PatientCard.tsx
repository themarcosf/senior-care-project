import { FC } from "react";

import Link from "next/link";

import styles from "./PatientCard.module.scss";

const PatientCard: FC<{
  id: number;
  physician: string;
  physicianArea: string;
}> = (props) => {
  const { id, physician, physicianArea } = props;

  return (
    <div className={styles.container}>
      <h1>{physician}</h1>
      <p>
        {physicianArea === undefined
          ? "Sem area"
          : `${physicianArea}`}
      </p>
      <div className={styles.actions}>
          <Link href="#">Mais detalhes</Link>
      </div>
    </div>
  );
};

export default PatientCard;
