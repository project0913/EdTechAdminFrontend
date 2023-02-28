import React from "react";
import styles from "./admin.module.css";

import { Link, Outlet, useNavigate } from "react-router-dom";
import { AdminDashboard } from "../AdminDashboard/AdminDashboard";
import AdminNotification from "../../components/AdminNotification";

export default function AdminUserDataView() {
  const navigate = useNavigate();
  const routeChange = (e: React.FormEvent<HTMLSelectElement>) => {
    console.log((e.target as HTMLSelectElement).value);
    const path = (e.target as HTMLSelectElement).value;
    navigate(path);
  };
  return (
    <div>
      <div className={styles.adminBg}>
        <ul className={styles.orderList}>
          <li>
            <Link to={""} state={{}}>
              Clerks
            </Link>
          </li>
          <li>
            <AdminNotification />
          </li>
          <li>
            <span className={styles.dataEditTxt}>
              <select
                name=""
                id=""
                className={styles.dataEditView}
                onChange={routeChange}
              >
                <option value="plain-question">
                  <span className={styles.spanText}>Insert Plain Question</span>
                </option>

                <option value="grouped-question">
                  <span>Insert Group Question</span>
                </option>

                <option value="direction">Insert Directions</option>
              </select>
            </span>
            <span className={styles.dataEditVi}>
              <select
                name=""
                id=""
                className={styles.dataEditView}
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
            </span>
          </li>
        </ul>
        <div>
          <button className={styles.logoutBtn}>Log out</button>
        </div>
      </div>
      <div className={styles.bodyAdmin}>
        <Outlet />
      </div>
    </div>
  );
}
