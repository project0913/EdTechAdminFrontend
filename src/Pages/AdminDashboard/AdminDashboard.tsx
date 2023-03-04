import { useEffect, useState } from "react";
import styles from "./adminDashboard.module.css";
import { Clerk } from "../../models/clerks.model";
import { format, formatDistance, formatISO, parseISO } from "date-fns";
import { getClerksAndDataInfoFromServer } from "../../DataService/clerkData.service";
import { Link } from "react-router-dom";
export function AdminDashboard() {
  const [clerks, setClerks] = useState<Clerk[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const getClerksAndDataInfo = async () => {
    const { clerks, totalData } = await getClerksAndDataInfoFromServer();
    setClerks(clerks);
    setTotalData(totalData);
  };
  useEffect(() => {
    getClerksAndDataInfo();
  }, []);
  return (
    <div className={styles.clerkTable}>
      <table className={styles.table}>
        <thead className={styles.tableHeaderTitle}>
          <tr className={styles.tr}>
            <th className={styles.th}>No.</th>
            <th className={styles.th}>Registration Date</th>
            <th className={styles.th}>User Name</th>
            <th className={styles.th}>Total Data Inserted</th>
            <th className={styles.th}>Total Balance</th>
            <th className={styles.th}>View Details</th>
          </tr>
        </thead>
        <tbody>
          {clerks.length > 0 ? (
            clerks.map((clerk, index) => (
              <tr className={styles.tr} key={index}>
                <td className={styles.td}>{index + 1}</td>
                <td className={styles.td}>
                  {format(parseISO(clerk.createdAt), "dd, MMM yyyy")}
                </td>
                <td className={styles.td}>{clerk.username}</td>
                <td className={styles.td}>{clerk.questionsEntered}</td>
                <td className={styles.td}>{clerk.questionsEntered * 3.5}</td>
                <td className={styles.td}>
                  <Link
                    to={"/view-clerk-detail"}
                    state={{
                      clerkId: clerk.adminId ? clerk.adminId : clerk._id,
                      username: clerk.username,
                    }}
                  >
                    <button className={styles.viewBtn}>View</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>Loading...</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className={styles.tfoot}>
            <td colSpan={2}>Total Data</td>
            <td>{totalData}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
