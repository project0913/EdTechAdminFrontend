import React from "react";
import styles from "./adminuserpage.module.css";
import PlainQuestionData from "../PlainQuestionPage/PlainQuestionData";
import { Link, Outlet } from "react-router-dom";

export default function AdminUserPage() {
  return (
    <div>
      <div className={styles.top}>
        <span className={styles.topBalance}>
       
        <label className={styles.balanceLabel}>Total Data </label><span className={styles.spanLabel}>12345</span>
        <label className={styles.balanceLabel}>Balance </label><span className={styles.spanLabel}>12345</span>

        </span>
        
      </div>
      <div className={styles.content}>
        <div className={styles.leftBar}>
          <ul className={styles.ulLeftBar}>
            <li className={styles.leftBarText}>
              <b>Data Insertion</b>{" "}
            </li>
            <li>
              <Link to={""}>
                <button className={styles.btnList}>
                  Insert Plain Questions
                </button>
              </Link>
            </li>
            <li>
              <Link to={"direction"}>
                <button className={styles.btnList}>Insert Directions</button>
              </Link>
            </li>
            <li >
              <Link to={"grouped-question"}>
                <button className={styles.btnList}>
                  Insert Grouped Question
                </button>
              </Link>
            </li>
            <li className={styles.leftBarText}>
              <b>Data Editing</b>{" "}
            </li>
            <li>
              <Link to={"view-plain-questions"}>
                <button className={styles.btnList}>
                  View Plain Questions{" "}
                </button>
              </Link>
            </li>
            <li>
              <Link to={"view-directions"}>
                <button className={styles.btnList}>View Directions </button>
              </Link>
            </li>

            <li>
              <Link to={"view-grouped-questions"}>
                <button className={styles.btnList}>
                  View Grouped Question{" "}
                </button>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.rightBar}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
