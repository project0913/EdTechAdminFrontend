import placeholderImage from "../../assets/place_holder.jpg";

import parse, {
  HTMLReactParserOptions,
  Element,
  domToReact,
} from "html-react-parser";
import { Link, useLocation } from "react-router-dom";
import {
  resolveImageURL,
  showErrorToast,
  showSuccessToast,
} from "../../utils/helper";
import { deleteGeneralQuestion } from "../../DataService/editQuestion.service";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { GeneralQuestion } from "../../models/general.model";
import CustomPagination from "../../components/pagination";
import styles from "./viewGeneral.module.css";

import { fetchGeneralQuestions } from "../../DataService/viewGeneralQuestion.service";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import { fetchExamCategories } from "../../DataService/fetchExamCatagories.service";
const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      return <span>{domToReact(domNode.children)}</span>;
    }
  },
};
export default function ViewExerciseQuestionPage() {
  const location = useLocation();
  let [initialPage, setInitialPage] = useState(
    location.state?.initialPage || 1
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<GeneralQuestion[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [examCatagories, setExamCatagories] = useState<SelectOption[]>([]);
  const [selectedExamCategory, setSelectedExamCategory] = useState("");

  useEffect(() => {
    if (!selectedExamCategory) return;
    getQuestion(initialPage);
  }, [selectedExamCategory]);

  useEffect(() => {
    fetchInit();
    console.log("init use effect");
  }, []);

  const fetchInit = async () => {
    setLoading(true);
    let data = await fetchExamCategories();
    let examCatsOption = [];
    for (const examCat of data) {
      if (examCat?.category && examCat?.category === "generalQuestion")
        examCatsOption.push({ label: examCat.name, value: examCat._id });
    }
    if (examCatsOption.length == 0) return;
    await setExamCatagories(examCatsOption);
    await setSelectedExamCategory(examCatsOption[0].value);
    getQuestion(initialPage);
    setLoading(false);
  };

  const handleExamCategoryChange = (e: any) => {
    setInitialPage(1);
    setSelectedExamCategory(e.target.value);
  };

  const getQuestion = async (page: number) => {
    setLoading(true);
    const { count, questions } = await fetchGeneralQuestions(
      page,
      selectedExamCategory
    );
    setLoading(false);
    setQuestions(questions);
    setTotalCount(count);
  };
  const onPageChange = async (page: number) => {
    setLoading(true);
    const { count, questions } = await fetchGeneralQuestions(
      page,
      selectedExamCategory
    );
    setLoading(false);
    setInitialPage(page);
    setQuestions(questions);
    setTotalCount(count);
  };
  const deleteGeneralQuestionFromServer = async (questionId: string) => {
    let result: any = await deleteGeneralQuestion(questionId);
    if (result instanceof AxiosError) {
      let msgTxt = "";
      const messages =
        result.response?.data?.message ||
        (["something is wrong try again Later"] as Array<string>);
      for (const msg of messages) {
        msgTxt += msg + " "; //concatenate array of error messages
      }
      setErrorMessage(msgTxt);
      showErrorToast();
    } else {
      setQuestions((prev) => {
        let newQues = prev.filter((q) => q._id !== questionId);
        return [...newQues];
      });

      showSuccessToast("Request Success");
    }
  };
  return (
    <div className="">
      <div style={{ marginLeft: "50px" }}>
        <p
          className={styles.txt}
          style={{
            fontWeight: "bold",
            color: "green",
            paddingTop: "10 px",
            marginTop: "10 px",
          }}
        >
          Select Category
        </p>
        <SelectDropdown
          title=""
          items={examCatagories}
          value={selectedExamCategory.toString()}
          handleSelect={handleExamCategoryChange}
        />
      </div>
      <div className="">
        <table className={styles.table}>
          <thead className={styles.tHeader}>
            <tr>
              <th
                className={`${styles.tableHeader} ${styles.th} ${styles.noColumn}`}
              >
                No
              </th>
              <th className={`${styles.th} ${styles.questionColumn}`}>
                Questions
              </th>
              <th className={styles.th}>Option 'A'</th>
              <th className={styles.th}>Option 'B'</th>
              <th className={styles.th}>Option 'C'</th>
              <th className={styles.th}>Option 'D'</th>
              <th className={`${styles.th} ${styles.answerColumn}`}>Ans</th>
              <th className={`${styles.th} ${styles.descriptionColumn}`}>
                Description
              </th>
              <th className={styles.th}>Que Img </th>
              <th className={styles.th}>Des Img </th>
              <th className={styles.th}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {!loading && questions.length > 0 ? (
              questions.map((question, index) => (
                <tr className={styles.row} key={index}>
                  <td className={`${styles.td}  ${styles.tdData}`}>
                    {question.questionNumber}
                  </td>

                  <td className={styles.td}>
                    {parse(question.questionText, options)}
                  </td>
                  <td className={styles.td}>
                    {parse(question.option_a, options)}
                  </td>
                  <td className={styles.td}>
                    {parse(question.option_b, options)}
                  </td>
                  <td className={styles.td}>
                    {parse(question.option_c, options)}
                  </td>
                  <td className={styles.td}>
                    {parse(question.option_d, options)}
                  </td>
                  <td className={styles.td}>{question.answer}</td>
                  <td className={styles.td}>
                    {parse(question?.description || " ", options)}
                  </td>
                  <td className={styles.td}>
                    <img
                      src={
                        resolveImageURL(question.questionImage || "") ||
                        placeholderImage
                      }
                      style={{ maxWidth: "130px", maxHeight: "60px" }}
                    />
                  </td>
                  <td className={styles.td}>
                    {" "}
                    <img
                      src={
                        resolveImageURL(question.descriptionImage || "") ||
                        placeholderImage
                      }
                      style={{ maxWidth: "130px", maxHeight: "60px" }}
                    />
                  </td>
                  <td className={styles.td}>
                    <div className={styles.tdLabel}>
                      <Link
                        to={"/admin-user/edit-general-questions"}
                        state={{ question, initialPage }}
                      >
                        <button
                          className={styles.label}
                          onClick={() => {
                            console.log("init---- " + initialPage);
                          }}
                        >
                          Edit
                        </button>
                      </Link>
                      <button
                        className={styles.label1}
                        onClick={() =>
                          deleteGeneralQuestionFromServer(question._id || "")
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : loading ? (
              <td colSpan={4}>Loading....</td>
            ) : (
              <td colSpan={4}>no question inserted for this category</td>
            )}
          </tbody>
        </table>
      </div>
      <div className="">
        <CustomPagination
          totalItems={totalCount}
          pageSize={10}
          onPageChange={onPageChange}
          activePage={initialPage}
        />
      </div>
    </div>
  );
}
