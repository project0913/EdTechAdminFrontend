import placeholderImage from "../../assets/place_holder.jpg";

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
import { deleteGeneralQuestion } from "../../DataService/editQuestion.service";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { GeneralQuestion } from "../../models/general.model";
import CustomPagination from "../../components/pagination";
import styles from "./general.module.css";

import { fetchGeneralQuestions } from "../../DataService/viewGeneralQuestion.service";
const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      return <span>{domToReact(domNode.children)}</span>;
    }
  },
};
export default function ViewExerciseQuestionPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [questions, setQuestions] = useState<GeneralQuestion[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    getQuestion(1);
  }, []);

  const getQuestion = async (page: number) => {
    const { count, questions } = await fetchGeneralQuestions(page);
    setQuestions(questions);
    setTotalCount(count);
  };
  const onPageChange = async (page: number) => {
    const { count, questions } = await fetchGeneralQuestions(page);

    setQuestions(questions);
    setTotalCount(count);
  };
  const deleteGeneralQuestionFromServer = async (questionId: string) => {
    let result: any = await deleteGeneralQuestionFromServer(questionId);
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
      <div className="">
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>No</th>
              <th className={styles.th}>Questions</th>
              <th className={styles.th}>Option 'A'</th>
              <th className={styles.th}>Option 'B'</th>
              <th className={styles.th}>Option 'C'</th>
              <th className={styles.th}>Option 'D'</th>
              <th className={styles.th}>Answer</th>
              <th className={styles.th}>Description</th>
              <th className={styles.th}>Question Image </th>
              <th className={styles.th}>Description Image </th>
              <th className={styles.th}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {questions.length > 0
              ? questions.map((question, index) => (
                  <tr className={styles.row} key={index}>
                    <td
                      className={`${styles.td} ${styles.tdNo} ${styles.tdData}`}>
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
                        style={{ maxWidth: "150px", maxHeight: "80px" }}
                      />
                    </td>
                    <td className={styles.td}>
                      {" "}
                      <img
                        src={
                          resolveImageURL(question.descriptionImage || "") ||
                          placeholderImage
                        }
                        style={{ maxWidth: "150px", maxHeight: "80px" }}
                      />
                    </td>
                    <td className={styles.td}>
                      <Link
                        to={"/admin-user/edit-general-question"}
                        state={{ question }}>
                        <button className={styles.label}>Edit</button>
                      </Link>
                      <button
                        className={styles.label1}
                        onClick={() =>
                          deleteGeneralQuestionFromServer(question._id || "")
                        }>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              : "Loading..."}
          </tbody>
        </table>
      </div>
      <div className="">
        <CustomPagination
          totalItems={totalCount}
          pageSize={10}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
