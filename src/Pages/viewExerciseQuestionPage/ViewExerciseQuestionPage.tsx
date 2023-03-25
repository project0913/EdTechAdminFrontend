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
import { deleteExerciseQuestion } from "../../DataService/editQuestion.service";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { ExerciseQuestion } from "../../models/exerciseQuestion.model";
import CustomPagination from "../../components/pagination";
import styles from "./viewExercise.module.css";
import { fetchExerciseQuestions } from "../../DataService/viewExerciseQuestion.service";
const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      return <span>{domToReact(domNode.children)}</span>;
    }
  },
};
export default function ViewExerciseQuestionPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("Loading...");
  const [questions, setQuestions] = useState<ExerciseQuestion[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const location = useLocation();
  useEffect(() => {
    const exerciseId = location.state.exerciseId;
    console.log("Exercise id is   ----" + exerciseId);

    if (exerciseId) getQuestion(exerciseId);
  }, []);

  const getQuestion = async (exerciseId: number) => {
    const questions = await fetchExerciseQuestions(exerciseId);
    if (questions.length == 0) {
      setMessage("No Questions inserted Yet For this Exercise");
      return;
    }
    setQuestions(questions);
  };

  const deleteExerciseQuestionFromServer = async (questionId: string) => {
    let result: any = await deleteExerciseQuestion(questionId);
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
    <div>
      <div className={styles.allTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={`${styles.tableHeader} ${styles.th}`}>No</th>
              <th className={`${styles.tableHeader} ${styles.th}`}>Question</th>
              <th className={`${styles.tableHeader} ${styles.th}`}>
                Option 'A'
              </th>
              <th className={`${styles.tableHeader} ${styles.th}`}>
                Option 'B'
              </th>
              <th className={`${styles.tableHeader} ${styles.th}`}>
                Option 'C'
              </th>
              <th className={`${styles.tableHeader} ${styles.th}`}>
                Option 'D'
              </th>
              <th className={`${styles.tableHeader} ${styles.th}`}>Answer</th>
              <th className={`${styles.tableHeader} ${styles.th}`}>
                Description
              </th>
              <th className={`${styles.tableHeader} ${styles.th}`}>
                Question Image{" "}
              </th>
              <th className={`${styles.tableHeader} ${styles.th}`}>
                Description Image{" "}
              </th>
              <th className={`${styles.tableHeader} ${styles.th}`}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {questions.length > 0
              ? questions.map((question, index) => (
                  <tr className={styles.tr} key={index}>
                    <td className={`${styles.td} ${styles.tdNo}`}>
                      {question?.questionNumber}
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
                      {parse(question?.description || "", options)}
                    </td>
                    <td className={styles.td}>
                      <img
                        style={{ maxWidth: "150px", maxHeight: "150px" }}
                        src={
                          resolveImageURL(question.questionImage || "") ||
                          placeholderImage
                        }
                      />
                    </td>
                    <td className={styles.td}>
                      {" "}
                      <img
                        style={{ maxWidth: "150px", maxHeight: "150px" }}
                        src={
                          resolveImageURL(question.descriptionImage || "") ||
                          placeholderImage
                        }
                      />
                    </td>
                    <td className={styles.td}>
                      <Link
                        to={"/admin-user/edit-exercise-question"}
                        state={{ question }}
                      >
                        <button className={styles.label}>Edit</button>
                      </Link>
                      <button
                        className={styles.label1}
                        onClick={() =>
                          deleteExerciseQuestionFromServer(question._id || "")
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              : message}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}></div>
    </div>
  );
}
