import { FC, ReactNode } from "react";

import styles from "./CardsList.module.scss";

const CardsList: FC<{ children: ReactNode }> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.cards}>{props.children}</div>
    </div>
  );
};

export default CardsList;
