import React, { useEffect, useState } from "react";
import SelectDropdown from "../../components/SelectDropdown";
import styles from "./viewClerkDetailPage.module.css";
import { BarChartComponent } from "../../components/BarChartComponent";
import {
  AllTimeData,
  ClerkCourseInsertionReport,
  fetchAllTimeDataInsertionReport,
  fetchDurationDataReport,
} from "../../DataService/clerkData.service";
import { useLocation } from "react-router-dom";
import { format, parseISO } from "date-fns";
export default function ViewClerkDetailPage() {
  const [selectedDuration, setSelectedDuration] = useState(7);
  const [username, setUsername] = useState("");
  const [clerkId, setClerkId] = useState("");
  const [intervalMessage, setIntervalMessage] = useState("Loading...");
  const [allTimeMessage, setAllTimeMessage] = useState("");
  const [durationalData, setDurationalData] = useState<
    ClerkCourseInsertionReport[]
  >([]);
  const [allTimeData, setAllTimeData] = useState<AllTimeData[]>([]);
  const location = useLocation();

  useEffect(() => {
    if (clerkId.length > 0) {
      console.log("frtching ................");

      fetchUserReport(selectedDuration);
    }
  }, [selectedDuration]);

  useEffect(() => {
    const clerkIdFromState = location.state.clerkId;
    const username = location.state.username;
    console.log("clerkid is " + clerkIdFromState);

    setClerkId((prv) => clerkIdFromState);
    setUsername((prv) => username);
    fetchUserReport(7, clerkIdFromState);
    getAllTimeData(clerkIdFromState);
  }, []);

  const fetchUserReport = async (
    duration: string | number,
    clerkid?: string
  ) => {
    const data = await fetchDurationDataReport(
      clerkid ? clerkid : clerkId,
      parseInt(duration.toString())
    );
    if (data.length == 0) {
      setIntervalMessage(
        "it looks like This Clerk didn't Entered any Data on this Interval"
      );
      return;
    }
    setDurationalData(data);
  };
  const getAllTimeData = async (cId: string) => {
    const data = await fetchAllTimeDataInsertionReport(cId);
    if (data.length == 0) {
      setAllTimeMessage("it looks like This Clerk didn't Entered any Data Yet");
      return;
    }
    setAllTimeData(data);
  };
  const handleSelectChange = (e: React.FormEvent<HTMLSelectElement>) => {
    console.log((e.target as HTMLSelectElement).value);
    const duration = (e.target as HTMLSelectElement).value;
    setSelectedDuration(parseInt(duration));
  };
  return (
    <div>
      <div className={styles.textHeader}>
        <span className={styles.viewSpan}>view clerk detail</span>

        <SelectDropdown
          handleSelect={handleSelectChange}
          items={[
            { label: "Weekly", value: "7" },
            { label: "monthly", value: "30" },
          ]}
          title=""
        />
      </div>

      <div className="container">
        <div className="row">
          {durationalData.length > 0 ? (
            durationalData.map((data, index) => (
              <div className="col-xs-12 col-md-6 col-lg-6 col-xl-6" key={index}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tr1}>
                      <th colSpan={2} className={styles.th}>
                        {data.name}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={styles.tr}>
                      <td className={styles.td1}>Date</td>
                      <td className={styles.td1}>amount</td>
                    </tr>
                    {data.insertions.map((insertion, i) => (
                      <tr className={styles.td} key={index + i}>
                        <td className={styles.td2}>
                          {" "}
                          {format(
                            parseISO(insertion.createdAt),
                            "dd, MMM yyyy"
                          )}
                        </td>
                        <td className={styles.td2}>{insertion.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>{intervalMessage}</p>
          )}
        </div>
      </div>
      <div className="container">
        <div className={styles.userNameTxt}>
          <h4>All Time Data Insertion Of {username}</h4>
          {allTimeMessage.length > 0 && <p>{allTimeMessage}</p>}
        </div>
        {allTimeData.length > 0 && <BarChartComponent data={allTimeData} />}
      </div>

      {allTimeData.length > 0 && (
        <div className={styles.spanTotalData}>
          <span>
            Total Data Inserted by {username} is{" "}
            {allTimeData.reduce((sum, value) => sum + value.count, 0)}
          </span>
        </div>
      )}
    </div>
  );
}
