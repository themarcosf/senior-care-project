import { FC } from "react";

import styles from "./Navbar.module.scss";
import Link from "next/link";

const Navbar: FC = () => {
  return (
    <nav className={styles.navContainer}>
      <ul>
        <li>
          <Link href="#">
            <img src="/icons/suport.svg" alt="suport_icon" />
            <p>Suporte</p>
          </Link>
        </li>
        <li>
          <Link href="/patients">
            <img src="/icons/home.svg" alt="home_icon" />
            <p>Pacientes</p>
          </Link>
        </li>
        <li>
          <Link href="#">
            <img src="/icons/profile.svg" alt="account_icon" />
            <p>Conta</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
