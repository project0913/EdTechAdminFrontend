import { FormEvent, useEffect, useState } from "react";
import styles from "./adminuserpage.module.css";

import { Outlet, useNavigate } from "react-router-dom";
import { getClerkInfoFromServer } from "../../DataService/clerkData.service";

export default function AdminUserPage() {
  const [totalData, setTotalData] = useState(0);
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const getClerkData = async () => {
    const user = await getClerkInfoFromServer();
    setTotalData(user.questionsEntered);
    setBalance(user.questionsEntered * 3.5);
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
  const routeChange = (e: FormEvent<HTMLSelectElement>) => {
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
              <div className="userName">
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
                <option selected disabled>
                  Select Plain Question
                </option>
                <option value="plain-question">Insert Plain Question</option>

                <option value="grouped-question">Insert Group Question</option>
                <option value="direction">Insert Directions</option>
                <option value="general-question">
                  Insert General Question
                </option>
                <option value="exercise">Insert Exercise Question Info</option>

                <option value="exercise-question">
                  Insert Exercise Question
                </option>
                <option value="exam-category">Insert Category</option>
                <option value="material-resource">
                  Insert Material resource
                </option>
              </select>

              <select
                name=""
                id=""
                className={styles.selectDropdown}
                onChange={routeChange}
              >
                {" "}
                <option selected disabled>
                  Select View Plain Question
                </option>
                <option value="/admin-user">View Plain Question</option>
                <option value="view-directions">View Directions</option>
                <option value="/admin-user">View Grouped Question</option>
                <option value="view-general-question">
                  View General Question
                </option>
                <option value="view-exercise">View Exercise Question</option>
              </select>
            </div>
            <div className={styles.topBalance2}>
              <label className={styles.balanceLabel}>Tot Data </label>
              <span className={styles.spanLabel}>{totalData}</span>

              <label className={styles.balanceLabel}>Your Balance </label>

              <span className={styles.spanLabel}>{balance}</span>
            </div>

            <div className={styles.logBtn}>
              <span>
                <button onClick={() => logout()} className={styles.logoutBtn}>
                  Log out
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
      </div>
    </div>
  );
}
