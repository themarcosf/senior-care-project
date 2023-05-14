import { FC, ReactNode } from "react";
import Link from "next/link";

import styles from "./Link.module.scss";

const Button: FC<{ children: ReactNode; link: string }> = (props) => {

  if (props.link.trim().length === 0) {
    return <></>;
  }
  return (
    <Link href={`${props.link}`} className={styles.link}>
      {props.children}
    </Link>
  );
};

export default Button;
