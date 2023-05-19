import { FC, useEffect, useState } from "react";
import { BsHeadset } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";

import styles from "./Navbar.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar: FC = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    const profileData = localStorage.getItem("profileData");

    if (profileData !== null) {
      setProfileName(JSON.parse(profileData).name);
    }
  }, []);

  return (
    <nav className={styles.navContainer}>
      <ul>
        <li>
          <Link
            className={pathname.includes("/suport") ? styles.active : ""}
            href="#"
          >
            <BsHeadset size={35} />
            <p>Suporte</p>
          </Link>
        </li>
        <li>
          <Link
            className={pathname.includes("/patients") ? styles.active : ""}
            href="/patients"
          >
            <AiOutlineHome size={35} />
            <p>Pacientes</p>
          </Link>
        </li>
        <li>
          <Link
            className={pathname.includes("/profile") ? styles.active : ""}
            href="/profile"
          >
            <BsFillPersonFill size={35} />
            <p>{profileName}</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
