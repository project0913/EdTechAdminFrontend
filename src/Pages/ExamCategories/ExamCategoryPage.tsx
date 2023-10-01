import { CSSProperties, useEffect, useState } from "react";
import styles from "./examcategoryPage.module.css";
import { AxiosError } from "axios";
import { showErrorToast, showSuccessToast } from "../../utils/helper";
import {
  createExamCategories,
  updateExamCategories,
} from "../../DataService/fetchExamCatagories.service";
import ErrorComponent from "../../components/ErrorComponent";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { FadeLoader } from "react-spinners";
import { Link, useLocation } from "react-router-dom";

const override: CSSProperties = {
  margin: "10 auto",
  borderColor: "red",
};

export const ExamCategoryPage = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("generalQuestion");
  const [message, setErrorMessage] = useState("");
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableExamCategory, setEditableExamCategory] = useState<any>(null);

  useEffect(() => {
    const editableExamCategoryState = location.state?.examCategory;

    if (editableExamCategoryState) {
      setIsEditMode(true);
      setEditableExamCategory(editableExamCategoryState);
      setName(editableExamCategoryState.name);
      setCategory(editableExamCategoryState.category);
    }
  }, []);

  const submitCategory = async () => {
    setLoading((prev) => true);

    if (!name || !category) return;

    let examCategory: any = {
      name,
      category,
    };
    console.log(examCategory);

    let result;
    if (!isEditMode) {
      result = await createExamCategories(examCategory);
    } else {
      result = await updateExamCategories(
        editableExamCategory?._id ?? "",
        examCategory
      );
    }
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
          <p className={styles.txt}>Name:</p>
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
          <p className={styles.txt}>Category:</p>
          <input
            value={category}
            placeholder="General_Question"
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
