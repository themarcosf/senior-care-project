import { FC } from "react";

import styles from "./Search.module.scss";

const Search: FC = (props) => {
  return (
    <div className={styles.content}>
      <div className={styles.inputField}>
        <input placeholder="Pesquise aqui" type="text" />
        <img src="/icons/search.svg" alt="search_icon" />
      </div>
      <button>
        <img src="/icons/filter.svg" alt="filter_icon" />
      </button>
    </div>
  );
};

export default Search;
