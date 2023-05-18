import { FC } from "react";

import styles from "./Header.module.scss";
import Button from "../Link/Link";

const Header: FC<{ title: string; buttonName: string; link: string }> = (
  props
) => {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div>
          <img src="/logo.svg" />
        </div>
        <h1>{props.title}</h1>
      </div>

        <Button link={props.link}>{props.buttonName}</Button>
    </header>
  );
};

export default Header;
