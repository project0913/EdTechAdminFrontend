import { CSSProperties, useEffect, useState } from "react";
import styles from "./adminChallenge.module.css";
import { AxiosError } from "axios";
import { showErrorToast, showSuccessToast } from "../../utils/helper";

import ErrorComponent from "../../components/ErrorComponent";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { FadeLoader } from "react-spinners";
import { Link, useLocation } from "react-router-dom";
import { createAdminChallenge } from "../../DataService/adminChallenge.service";

const override: CSSProperties = {
  margin: "10 auto",
  borderColor: "red",
};

export const AdminChallenge = () => {
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState("");
  const [level, setLevel] = useState(7);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [message, setErrorMessage] = useState("");

  const submitChallenge = async () => {
    //  createAdminChallenge;
    setLoading((prev) => true);
    const adminChallenge = {
      label: label,
      level: level,
      startDate: startDate,
      endDate: endDate,
      isActive: isActive,
    };

    if (!label || !level || !startDate || !endDate) return;

    let result = await createAdminChallenge(adminChallenge);
    setLoading((prev) => false);
    if (result instanceof AxiosError) {
      let msgTxt = "";
      const messages =
        result.response?.data?.message ||
        (["something is wrong try again Later"] as Array<string>);
      for (const msg of messages) msgTxt += msg + " ";
      setErrorMessage(msgTxt);
      showErrorToast();
    } else {
      showSuccessToast("Request Success ");
    }
  };

  return (
    <LoadingOverlayWrapper
      active={loading}
      spinner={
        <FadeLoader
          loading={loading}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      }
    >
      <div className={styles.headerBg}>
        <div>
          <p className={styles.txt}>Challenge Label:</p>
          <input
            value={label}
            placeholder="
            Dec challenge"
            onChange={(e) => setLabel(e.target.value)}
            className={styles.editor}
          />
          <br />
          <ErrorComponent value={label} />
        </div>

        <div>
          <p className={styles.txt}>Category:</p>
          <input
            type="number"
            min={7}
            value={level}
            placeholder="7"
            onChange={(e) => setLevel(parseInt(e.target.value))}
            className={styles.editor}
          />
          <br />
          <ErrorComponent value={level.toString()} />
        </div>

        <div>
          <p className={styles.txt}>Challenge Start Date:</p>
          <input
            type="date"
            value={startDate}
            placeholder="
            challenge Start date"
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.editor}
          />
          <br />
          <ErrorComponent value={startDate} />
        </div>

        <div>
          <p className={styles.txt}>Challenge End Date:</p>
          <input
            type="date"
            value={endDate}
            placeholder="
            challenge End Date"
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.editor}
          />
          <br />
          <ErrorComponent value={endDate} />
        </div>

        <div>
          <p className={styles.txt}>Make Challenge Active:</p>
          <input
            type="checkbox"
            placeholder="
            make challenge Active now"
            onChange={(e) => setIsActive(!isActive)}
            className={styles.editor}
          />
          <br />
        </div>

        <div>
          <button
            onClick={() => {
              submitChallenge();
            }}
            className={styles.submitBtn}
          >
            Submit
          </button>

          <Link to={"/admin-user/view-exam-category"} state={{}}>
            <button className={styles.backBtn} style={{ marginLeft: "20px" }}>
              Back To view Exam Category{" "}
            </button>
          </Link>
        </div>
      </div>
    </LoadingOverlayWrapper>
  );
};
