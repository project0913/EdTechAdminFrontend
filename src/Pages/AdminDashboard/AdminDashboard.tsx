import { useEffect, useState } from "react";
import styles from "./adminDashboard.module.css";
import { Clerk } from "../../models/clerks.model";
import { format, formatDistance, formatISO, parseISO } from "date-fns";
import { getClerksAndDataInfoFromServer } from "../../DataService/clerkData.service";
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
    <div>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>No.</th>
            <th className={styles.th}>Registration Date</th>
            <th className={styles.th}>username</th>
            <th className={styles.th}>Total data inserted</th>
            <th className={styles.th}>ToTal balance</th>
          </tr>
        </thead>
        <tbody>
          {clerks.length > 0 ? (
            clerks.map((clerk, index) => (
              <tr className={styles.tr}>
                <td className={styles.td}>{index + 1}</td>
                <td className={styles.td}>
                  {format(parseISO(clerk.createdAt),'dd, MMM yyyy')}
                </td>
                <td className={styles.td}>{clerk.username}</td>
                <td className={styles.td}>{clerk.questionsEntered}</td>
                <td className={styles.td}>{clerk.questionsEntered * 3}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>Loading...</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className={styles.tr}>
            <td colSpan={2}>Total Data</td>
            <td>{totalData}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
