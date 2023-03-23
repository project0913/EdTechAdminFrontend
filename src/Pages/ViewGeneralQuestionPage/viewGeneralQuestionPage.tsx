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
            <tr className={styles.row}>
              <th className={styles["col-xs-1"]}>No</th>
              <th className={styles["col-xs-2"]}>Questions</th>
              <th className={styles["ol-xs-9"]}>Option 'A'</th>
              <th className={styles["ol-xs-8"]}>Option 'B'</th>
              <th className={styles["l-xs-7"]}>Option 'C'</th>
              <th className={styles["co\\l-xs-6"]}>Option 'D'</th>
              <th className={styles["coxs-5"]}>Answer</th>
              <th className={styles["cl-xs-4"]}>Description</th>
              <th className={styles["cl-xs-3"]}>Question Image </th>
              <th className={styles["ol-xs-2"]}>Description Image </th>
              <th className={styles["ol-xs-1"]}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {questions.length > 0
              ? questions.map((question, index) => (
                  <tr className={styles.row} key={index}>
                    {/* <td>
                      <p>{question.questionNumber}</p>
                    </td>
                    <td>
                      <p>{parse(question.questionText, options)}</p>
                    </td>
                    <td>
                      <p> {parse(question.option_a, options)}</p>
                    </td> */}
                    <td className={styles.ow}>{question.questionNumber}</td>

                    <td className={styles["col-xs-1"]}>
                      {parse(question.questionText, options)}
                    </td>
                    <td className={styles["col-xs-2"]}>
                      {parse(question.option_a, options)}
                    </td>
                    <td className={styles["col-x-8"]}>
                      {parse(question.option_b, options)}
                    </td>
                    <td className={styles["cols-7"]}>
                      {parse(question.option_c, options)}
                    </td>
                    <td className={styles["co-xs-6"]}>
                      {parse(question.option_d, options)}
                    </td>
                    <td className={styles["cl-xs-5"]}>{question.answer}</td>
                    <td className={styles["ol-xs-4"]}>
                      {parse(question?.description || " ", options)}
                    </td>
                    <td className={styles["ol-xs-3"]}>
                      <img
                        src={
                          resolveImageURL(question.questionImage || "") ||
                          placeholderImage
                        }
                      />
                    </td>
                    <td className={styles["col-s-2"]}>
                      {" "}
                      <img
                        src={
                          resolveImageURL(question.descriptionImage || "") ||
                          placeholderImage
                        }
                      />
                    </td>
                    <td className={styles["col-xs-1"]}>
                      <Link
                        to={"/admin-user/edit-general-question"}
                        state={{ question }}
                      >
                        <button className="">Edit</button>
                      </Link>
                      <button
                        className=""
                        onClick={() =>
                          deleteGeneralQuestionFromServer(question._id || "")
                        }
                      >
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
