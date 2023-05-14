import { FC } from "react";
import { useRouter } from "next/router";

import styles from "./Card.module.scss";
import Link from "next/link";

type CardProps = {
  title: string;
  subtitle: string;
}

const Card: FC<{id: number, title: string, subtitle: string}> = (props) => {
  const router = useRouter();
  const pathname = router.pathname;

  const { id, title, subtitle } = props;

  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      <p>{pathname === "/patients" && "Última Evolução: "}{subtitle}</p>
      <div className={styles.actions}>
        {pathname === "/patients" ? (
          <>
            <Link href={`/patients/${id}`}>Histórico</Link>
            <Link href={`/newEvolution/${id}`}>Nova Evolução</Link>
          </>
        ) : (
          <Link href="#">Mais detalhes</Link>
        )}
      </div>
    </div>
  );
};

export default Card;
