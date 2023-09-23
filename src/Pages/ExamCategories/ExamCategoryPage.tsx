import { CSSProperties, useEffect, useState } from "react";
import styles from "./exercisePage.module.css";
import { AxiosError } from "axios";
import { showErrorToast, showSuccessToast } from "../../utils/helper";
import { createExamCategories } from "../../DataService/fetchExamCatagories.service";
import ErrorComponent from "../../components/ErrorComponent";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { FadeLoader } from "react-spinners";

const override: CSSProperties = {
  margin: "10 auto",
  borderColor: "red",
};

export const ExamCategoryPage = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [message, setErrorMessage] = useState("");

  const submitCategory = async () => {
    setLoading((prev) => true);

    if (!name || !category) return;

    let examCategory: any = {
      name,
      category,
    };
    console.log(examCategory);

    let result = await createExamCategories(examCategory);
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
      <div className={styles.headerBg} style={{ marginLeft: "50px" }}>
        <div>
          <p className={styles.txt}>name</p>
          <input
            value={name}
            placeholder="
            Geography"
            onChange={(e) => setName(e.target.value)}
            className={styles.editor}
          />
          <br />
          <ErrorComponent value={name} />
        </div>

        <div>
          <p className={styles.txt}>Category</p>
          <input
            value={category}
            placeholder="generalQuestion"
            onChange={(e) => setCategory(e.target.value)}
            className={styles.editor}
          />
          <br />
          <ErrorComponent value={category} />
        </div>

        <div>
          <button
            onClick={() => {
              submitCategory();
            }}
            className={styles.submitBtn}
          >
            Submit
          </button>
        </div>
      </div>
    </LoadingOverlayWrapper>
  );
};
