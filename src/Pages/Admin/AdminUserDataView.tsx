import { FormEvent } from "react";
import styles from "./admin.module.css";

import { Link, Outlet, useNavigate } from "react-router-dom";

import AdminNotification from "../../components/AdminNotification";

export default function AdminUserDataView() {
  const navigate = useNavigate();
  const routeChange = (e: FormEvent<HTMLSelectElement>) => {
    console.log((e.target as HTMLSelectElement).value);
    const path = (e.target as HTMLSelectElement).value;
    navigate(path);
  };
  const logout = () => {
    localStorage.removeItem("coydoeAdminUser");
    navigate("/");
  };
  return (
    <div>
      <div className={styles.adminBg}>
        <div className={styles.headerList}>
          <div className={styles.clerkNotification}>
            <div>
              <Link to={""} state={{}}>
                Clerks
              </Link>
            </div>
            <div>
              <AdminNotification />
            </div>
          </div>
          <div className={styles.logBtn}>
            <button className={styles.logoutBtn} onClick={() => logout()}>
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className={styles.dropdownBg}>
        <div className={styles.dropdownItem}>
          <select
            name=""
            id=""
            onChange={routeChange}
            className={styles.dataEditView}
          >
            <option value="">Data Insertion</option>
            <option value="plain-question">
              <span className={styles.spanText}>Plain Question</span>
            </option>

            <option value="grouped-question">
              <span>Group Question</span>
            </option>

            <option value="direction">Insert Directions</option>
          </select>

          <select
            name=""
            id=""
            onChange={routeChange}
            className={styles.dataEditView}
          >
            <option value="">Data Viewing </option>
            <option value="view-plain-questions">Plain Question</option>

            <option value="view-directions">View Directions</option>

            <option value="view-grouped-questions">Grouped Question</option>
            <option value="view-general-questions">
              View General Question
            </option>
            <option value="view-exercise-questions">
              View Exercise Question
            </option>
          </select>
        </div>
      </div>
      <div className={styles.bodyAdmin}>
        <Outlet />
      </div>
    </div>
  );
}
