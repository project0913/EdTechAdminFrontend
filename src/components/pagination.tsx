import { useState } from "react";
import styles from "./pagination.module.css";

export type Props = {
  pageSize: number;
  totalItems: number;
  activePage: number;
  onPageChange: (n: number) => void;
};

export default function CustomPagination({
  pageSize,
  totalItems,
  onPageChange,
  activePage = 0,
}: Props) {
  const pageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= Math.ceil(totalItems / pageSize); i++) {
      pages.push(i);
    }
    return pages;
  };
  const [activeNum, setActiveNum] = useState(activePage > 0 ? activePage : 1);

  return (
    <ul className={styles.pagination}>
      {pageNumbers().map((num) => (
        <li
          key={num}
          onClick={() => {
            onPageChange(num);
          }}
        >
          <a
            className={activeNum == num ? styles.activeLink : ""}
            onClick={() => setActiveNum(num)}
          >
            {num}
          </a>
        </li>
      ))}
    </ul>
  );
}
