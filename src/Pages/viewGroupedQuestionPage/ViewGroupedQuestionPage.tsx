import { useLocation } from "react-router-dom";
import placeholderImage from "../../assets/place_holder.jpg";
import { PlainQuestion } from "../../models/question.model";
import styles from "./viewGroupedQuestionPage.module.css";
import { ViewPlainQuestionContext } from "../../context/viewPlainQuestionContext";

import { useContext, useEffect, useRef, useState } from "react";

import parse, {
  HTMLReactParserOptions,
  Element,
  domToReact,
} from "html-react-parser";
import { Link } from "react-router-dom";
import {
  resolveImageURL,
  showErrorToast,
  showSuccessToast,
} from "../../utils/helper";

import { fetchGroupedQuestions } from "../../DataService/viewGroupedQuestion.service";
import {
  deleteGroupedQuestion,
  deletePlainQuestion,
} from "../../DataService/editQuestion.service";
import { AxiosError } from "axios";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      return <span>{domToReact(domNode.children)}</span>;
    }
  },
};

export function ViewGroupedQuestionsPage() {
  const location = useLocation();
  const selectedDirection = location.state?.direction;
  const viewPlainQuestionState = useContext(ViewPlainQuestionContext);

  const [progressMessage, setProgressMessage] = useState("Loading...");
  const [errorMessage, setErrorMessage] = useState("");
  const [questions, setQuestions] = useState<PlainQuestion[]>([]);

  const isInitialMount = useRef(true);
  async function fetchGroupedQuestionFromServer(
    courseId?: string,
    year?: number
  ) {
    //fetch grouped questions from server by direction id
    let questionsFromServer = await fetchGroupedQuestions(selectedDirection);
    setQuestions(questionsFromServer);
  }

  useEffect(() => {
    fetchGroupedQuestionFromServer();
  }, []);

  const deleteGroupedQuestionFromServer = async (questionId: string) => {
    let result = await deleteGroupedQuestion(questionId);
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

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      //fetch grouped question by direction Id
      (async () => {
        let questionsFromServer = await fetchGroupedQuestions(
          selectedDirection
        );
        setQuestions(questionsFromServer);
      })();
    }
  }, [selectedDirection]);
  return (
    <div>
      <div className={styles.adminBody}></div>
      <div>
        <table className={styles.table}>
          <thead>
            <tr className={styles.row}>
              <th
                className={`${styles.tableHeader} ${styles.th} ${styles.noColumn}`}
              >
                No
              </th>
              <th
                className={`${styles.tableHeader} ${styles.th} ${styles.yearColumn}`}
              >
                Year
              </th>
              <th className={`${styles.th} ${styles.questionColumn}`}>
                Questions
              </th>
              <th className={` ${styles.th}`}>Option 'A'</th>
              <th className={` ${styles.th}`}>Option 'B'</th>
              <th className={` ${styles.th}`}>Option 'C'</th>
              <th className={`${styles.th}`}>Option 'D'</th>
              <th className={` ${styles.th} ${styles.answerColumn}`}>Ans</th>
              <th className={` ${styles.th} ${styles.descriptionColumn}`}>
                Description
              </th>
              <th className={`${styles.th}`}>Que Img </th>
              <th className={` ${styles.th}`}>Des Img </th>
              <th className={`${styles.th}`}>Manage</th>
            </tr>
          </thead>
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <tr className={styles.tr} key={index}>
                <td className={styles.td}>{question.questionNumber}</td>
                <td className={styles.td}>{question.year}</td>
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
                  {parse(question.description, options)}
                </td>
                <td className={styles.td}>
                  <img
                    style={{ maxWidth: "130px", height: "60px" }}
                    src={
                      resolveImageURL(question.questionImage || "") ||
                      placeholderImage
                    }
                  />
                </td>
                <td className={styles.td}>
                  {" "}
                  <img
                    style={{ maxWidth: "130px", height: "60px" }}
                    src={
                      resolveImageURL(question.descriptionImage || "") ||
                      placeholderImage
                    }
                  />
                </td>
                <td className={styles.td}>
                  <Link
                    to={"/admin-user/edit-plain-question"}
                    state={{ question }}
                  >
                    <button
                      className={styles.label}
                      onClick={() => {
                        viewPlainQuestionState.setPlainQuestionState({
                          courses: [],
                          page: 1,
                          selectedCourse: selectedDirection,
                          selectedYear: "",
                          years: [],
                        });
                      }}
                    >
                      Edit
                    </button>
                  </Link>
                  <button
                    className={styles.label1}
                    onClick={() =>
                      deleteGroupedQuestionFromServer(question._id || "")
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>{progressMessage}</td>
            </tr>
          )}
        </table>
      </div>
    </div>
  );
}
