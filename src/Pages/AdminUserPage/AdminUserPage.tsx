import React, { useEffect, useState } from "react";
import styles from "./adminuserpage.module.css";
import PlainQuestionData from "../PlainQuestionPage/PlainQuestionData";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getClerkInfoFromServer } from "../../DataService/clerkData.service";

export default function AdminUserPage() {
  const [totalData, setTotalData] = useState(0);
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const getClerkData = async () => {
    const user = await getClerkInfoFromServer();
    setTotalData(user.questionsEntered);
    setBalance(user.questionsEntered * 3);
    setUsername(user.username);
  };
  useEffect(() => {
    getClerkData();
  }, []);
  const logout = async () => {
    localStorage.removeItem("coydoePublicUser");
    localStorage.removeItem("coydoeClerkUser");
    navigate("/", { replace: true });
  };
  const routeChange = (e: React.FormEvent<HTMLSelectElement>) => {
    console.log((e.target as HTMLSelectElement).value);
    const path = (e.target as HTMLSelectElement).value;
    navigate(path);
  };
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.rightHeader}>
          <div className={styles.userProfileName}>
            <div className={styles.iconContainer}>
              <i className={`fas fa-user  ${styles.userIcon}`}></i>
              <div>
                <span className={styles.userNameTxt}>
                  {username.toUpperCase()}
                </span>
              </div>
            </div>

            <div className={styles.selectionOption}>
              <select
                name=""
                id=""
                onChange={routeChange}
                className={styles.selectDropdown}
              >
                <option value="">
                  <span className={styles.spanText}>
                    Select Insert Plain Question
                  </span>
                </option>

                <option value="grouped-question">
                  <span>Insert Group Question</span>
                </option>

                <option value="direction">Insert Directions</option>
              </select>

              <select
                name=""
                id=""
                className={styles.selectDropdown}
                onChange={routeChange}
              >
                <option value="view-plain-questions">
                  View Plain Question
                </option>

                <option value="view-directions">View Directions</option>

                <option value="view-grouped-questions">
                  View Grouped Question
                </option>
              </select>
            </div>
            <div className={styles.topBalance2}>
              <label className={styles.balanceLabel}>Your Total Data </label>
              <span className={styles.spanLabel}>{totalData}</span>

              <label className={styles.balanceLabel}>Your Balance </label>

              <span className={styles.spanLabel}>{balance}</span>
            </div>

            <div className={styles.logBtn}>
              <span>
                <button onClick={() => logout()} className={styles.logoutBtn}>
                  Log out <i className="fas fa-sign-out-alt"></i>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <Outlet />
        </div>
        {/* <div className={styles.rightBar}>
          <Outlet />
        </div> */}
      </div>
    </div>
  );
}
