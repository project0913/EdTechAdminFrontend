import { useLocation, useNavigate } from "react-router-dom";
import { fetchPlainQuestions } from "../../DataService/viewPlainQuestion.service";
import placeholderImage from "../../assets/place_holder.jpg";
import { PlainQuestion } from "../../models/question.model";
import styles from "./viewQuestionsPage.module.css";
import React, { useEffect, useRef, useState, useContext } from "react";
import { ViewPlainQuestionContext } from "../../context/viewPlainQuestionContext";
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
import ReactPaginate from "react-paginate";
import { deletePlainQuestion } from "../../DataService/editQuestion.service";
import { AxiosError } from "axios";
import CustomPagination from "../../components/pagination";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      return <span>{domToReact(domNode.children)}</span>;
    }
  },
};

export default function ViewPlainQuestionsPage() {
  const location = useLocation(); // let token = location.state?.token as string;
  const selectedYear: number | string = location.state?.year;
  const selectedCourse: string = location.state?.course;
  const page = location.state?.page;
  const viewPlainQuestionState = useContext(ViewPlainQuestionContext);
  const [questions, setQuestions] = useState<PlainQuestion[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalCount, setTotalCount] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(page || 0);
  const isInitialMount = useRef(true);
  const isInitialMount2 = useRef(true);
  const { setPlainQuestionState, ...clean } = viewPlainQuestionState;

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
    }
  }, [selectedCourse]);

  useEffect(() => {
    getQuestions({
      course: selectedCourse,
      year: selectedYear,
      page: activePage,
    });
  }, []);

  const deletePlainQuestionFromServer = async (questionId: string) => {
    let result = await deletePlainQuestion(questionId);
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

  const getQuestions = async ({
    course,
    year,
    page,
  }: {
    course: string;
    year: string | number;
    page: number;
  }) => {
    console.log("the page rrrrrrrrrrrrr " + page);

    const { count, questions } = await fetchPlainQuestions({
      course,
      year,
      page,
    });
    setQuestions(questions);
    setTotalCount(count);
  };
  const onPageChange = async (page: number) => {
    const { count, questions } = await fetchPlainQuestions({
      course: selectedCourse,
      year: selectedYear,
      page: page,
    });
    setActivePage(page);
    setQuestions(questions);
    setTotalCount(count);
  };

  return (
    <div className={styles.all}>
      <div className={styles.allTable}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.row}>
              <th className={` ${styles.th} ${styles.thNo}`}>No</th>
              <th className={`${styles.th}`}>Year</th>
              <th className={`${styles.th}`}>Questions</th>
              <th className={` ${styles.th}`}>Option 'A'</th>
              <th className={` ${styles.th}`}>Option 'B'</th>
              <th className={` ${styles.th}`}>Option 'C'</th>
              <th className={`${styles.th}`}>Option 'D'</th>
              <th className={` ${styles.th}`}>Answer</th>
              <th className={` ${styles.th}`}>Description</th>
              <th className={`${styles.th}`}>Question Image </th>
              <th className={` ${styles.th}`}>Description Image </th>
              <th className={`${styles.th}`}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {questions.length > 0
              ? questions.map((question, index) => (
                  <tr className={styles.row} key={index}>
                    <td
                      className={`${styles.td} ${styles.tdNo} ${styles.tdData}`}
                    >
                      <span> {question.questionNumber}</span>
                    </td>
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
                        style={{ maxWidth: "130px", maxHeight: "60px" }}
                        src={
                          resolveImageURL(question.questionImage || "") ||
                          placeholderImage
                        }
                      />
                    </td>
                    <td className={styles.td}>
                      {" "}
                      <img
                        style={{ maxWidth: "130px", maxHeight: "60px" }}
                        src={
                          resolveImageURL(question.descriptionImage || "") ||
                          placeholderImage
                        }
                      />
                    </td>
                    <td className={styles.td}>
                      <div className={styles.tHeader}>
                        <Link
                          to={"/admin-user/edit-plain-question"}
                          state={{ question }}
                        >
                          <button
                            className={styles.label}
                            onClick={() => {
                              viewPlainQuestionState.setPlainQuestionState({
                                courses: [],
                                page: activePage > 0 ? activePage : 1,
                                selectedCourse,
                                selectedYear,
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
                            deletePlainQuestionFromServer(question._id || "")
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : "Loading..."}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <CustomPagination
          totalItems={totalCount}
          pageSize={10}
          onPageChange={onPageChange}
          activePage={activePage}
        />
      </div>
    </div>
  );
}
