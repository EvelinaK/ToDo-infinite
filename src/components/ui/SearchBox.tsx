import styles from "../../style/ui/searchBox.module.scss";
import React, { Dispatch, SetStateAction, useState } from "react";

interface SearchProps {
  searchValue: string;
  onChange: Dispatch<SetStateAction<string>>;
}

const SearchBox = ({ onChange, searchValue }: SearchProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <main className={styles.mainContainer}>
      <div className={styles.container}>
        <div
          className={`${styles.searchBox} ${
            isFocused ? styles.borderSearching : ""
          }`}
        >
          {/* <div className={styles.searchIcon}> */}
          <i
            className={`${styles.searchIcon} ${
              isFocused ? styles.siRotate : ""
            }`}
          ></i>
          {/* </div> */}
          <form action="" className={styles.searchForm} onSubmit={handleSubmit}>
            <input
              type="search"
              placeholder="Search"
              id="search"
              autoComplete="off"
              className={styles.searchInput}
              value={searchValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(e) => onChange(e.target.value)}
            />
          </form>

          <svg
            className={styles.searchBorder}
            version="1.1"
            x="0px"
            y="0px"
            viewBox="0 0 671 111"
          >
            <path
              className={styles.border}
              d="M335.5,108.5h-280c-29.3,0-53-23.7-53-53v0c0-29.3,23.7-53,53-53h280"
            />
            <path
              className={styles.border}
              d="M335.5,108.5h280c29.3,0,53-23.7,53-53v0c0-29.3-23.7-53-53-53h-280"
            />
          </svg>
          {/* <div
            className={`${styles.goIcon} ${
              searchValue.length > 0 ? styles.goIn : ""
            }`}
          >
            <i className="fa fa-arrow-right"></i>
          </div> */}
        </div>
      </div>
    </main>
  );
};

export default SearchBox;
