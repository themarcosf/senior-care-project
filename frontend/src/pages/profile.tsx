import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { BiLogOut } from "react-icons/bi";

import styles from "@/styles/profile.module.scss";
import { GetServerSideProps } from "next";
import { FC } from "react";
import { profile } from "@/models/profile";

const Profile: FC<{
  profileData: profile;
  statistics: {
    medRecordTotal: number;
    medProgressionTotal: number;
  };
}> = ({ profileData, statistics }) => {
  const route = useRouter();

  const signoutHandler = () => {
    Cookies.remove("token");
    route.push("/");
  };

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h1>Perfil</h1>
        <button onClick={signoutHandler}>
          <BiLogOut size={25} fill="var(--neutral-400)" />
          Sair
        </button>
      </div>
      <div className={styles.profile}>
        <div className={styles.profileImage}>
          <img
            // src={profileData.avatar}
            src="https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg"
            alt="Avatar"
          />
        </div>
        <div className={styles.profileInfo}>
          <h2>{profileData.name}</h2>
          <p>{profileData.role}</p>
          <p>{profileData.licenseNum}</p>
        </div>
      </div>
      <div className={styles.statistics}>
        <div>
          <h3>{statistics.medRecordTotal}</h3>
          <p>Prontuários</p>
        </div>
        <div>
          <h3>{statistics.medProgressionTotal}</h3>
          <p>Evoluções</p>
        </div>
      </div>
      <div className={styles.qrCodeContainer}>
        <h2>QR Code</h2>
        <div>
          <img
            src="https://t3.gstatic.com/licensed-image?q=tbn:ANd9GcSh-wrQu254qFaRcoYktJ5QmUhmuUedlbeMaQeaozAVD4lh4ICsGdBNubZ8UlMvWjKC"
            alt="QR Code"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;

  const token = req.cookies["token"];

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const profileResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/profile`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const profileData = await profileResponse.json();

  const statistics = {
    medRecordTotal: 0,
    medProgressionTotal: 0,
  };

  return {
    props: {
      profileData,
      statistics,
    },
  };
};
