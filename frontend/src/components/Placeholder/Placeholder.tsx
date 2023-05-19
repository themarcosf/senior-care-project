import { FC } from "react";

import notFound from "../../../public/not-found.json";
import { useLottie } from "lottie-react";

import styles from "./Placeholder.module.scss";
import Link from "next/link";

const Placeholder: FC<{ contentSize: number; text: string; link: string, btnText: string }> = ({
  text,
  link,
  contentSize,
  btnText
}) => {
  const options = {
    animationData: notFound,
    loop: true,
  };

  const { View } = useLottie(options);

  return (
    <>
      {contentSize === 0 && (
        <div className={styles.placeholder}>
          {View}
          <h1>{text}</h1>
        </div>
      )}
      <div className={styles.newEvolutionBtn}>
        <button>
          <Link href={link}>{btnText}</Link>
        </button>
      </div>
    </>
  );
};

export default Placeholder;
