import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import placeholderImage from "../../assets/place_holder.jpg";
import { PlainQuestion } from "../../models/question.model";
import styles from "./viewGroupedQuestionPage.module.css";
import React, { useEffect, useRef, useState } from "react";

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
import {
  fetchDirectionOfCourseByYear,
  fetchGroupedCourses,
  fetchGroupedCoursesDirectionYears,
} from "../../DataService/fetchCourse.service";
import { fetchGroupedQuestions } from "../../DataService/viewGroupedQuestion.service";
import { deletePlainQuestion } from "../../DataService/editQuestion.service";
import { AxiosError } from "axios";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      return <span>{domToReact(domNode.children)}</span>;
    }
  },
};

export function ViewGroupedQuestionsPage() {
  const [selectedDirection, setSelectedDirection] = useState("");
  const [progressMessage, setProgressMessage] = useState("Loading...");
  const [errorMessage, setErrorMessage] = useState("");
  const [questions, setQuestions] = useState<PlainQuestion[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | string>("2015");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [yearOptions, setYearOptions] = useState<SelectOption[]>([]);
  const [courseOptions, setCourseOptions] = useState<SelectOption[]>([]);
  const [directionsOption, setDirectionsOption] = useState<SelectOption[]>([]);
  const isInitialMount = useRef(true);
  async function fetchGroupedQuestionFromServer(
    courseId?: string,
    year?: number
  ) {
    let filteringCourseId = "",
      filteringYear = 2015;
    if (!(courseId && year)) {
      //if courseId or  year not provided  fetch all from server
      const groupedCourses = await fetchGroupedCourses();
      setCourseOptions(groupedCourses);
      const defaultCourseId = groupedCourses[0].value;
      filteringCourseId = defaultCourseId;
      setSelectedCourse(defaultCourseId);
      const years = await fetchGroupedCoursesDirectionYears(defaultCourseId);
      setYearOptions(years);
      if (years.length == 0) {
        setProgressMessage("it looks like you don't have data yet");
        return;
      }
      const defaultYear = years[0].value;
      filteringYear = parseInt(defaultYear);
      setSelectedYear(defaultYear);
    } else {
      filteringCourseId = courseId;
      filteringYear = year;
    }

    //getDirections and populate
    const directionsFromServer = await fetchDirectionOfCourseByYear(
      filteringCourseId,
      filteringYear
    );
    const defaultDirectionId = directionsFromServer[0].value;
    console.log(directionsFromServer);
    setSelectedDirection(defaultDirectionId);
    setDirectionsOption(directionsFromServer);
    //fetch grouped questions from server by direction id
    let questionsFromServer = await fetchGroupedQuestions(defaultDirectionId);
    setQuestions(questionsFromServer);
  }

  const handleSelectYear = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedYear((e.target as HTMLSelectElement).value);
  };
  const handleSelectCourse = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedCourse((e.target as HTMLSelectElement).value);
  };
  const handleDirectionChange = (e: any) => {
    setSelectedDirection(e.target.value);
  };

  useEffect(() => {
    fetchGroupedQuestionFromServer();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (selectedCourse && selectedYear)
        fetchGroupedQuestionFromServer(
          selectedCourse,
          parseInt(selectedYear.toString())
        );
    }
  }, [selectedCourse, selectedYear]);

  const deleteGroupedQuestionFromServer = async (questionId: string) => {
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
      <div className={styles.adminBody}>
        <div className={styles.groupedHeader}>
          <span className="list-course mt-3">
            <b style={{ color: "white" }}>Courses</b>
            <SelectDropdown
              title=""
              items={courseOptions}
              handleSelect={handleSelectCourse}
              styles={{ display: "inline", width: "3rem" }}
            />
          </span>
          <span className="year-selection mt-3">
            <b style={{ color: "white" }}>Select Year</b>
            <SelectDropdown
              title=""
              items={yearOptions}
              handleSelect={handleSelectYear}
              styles={{ display: "inline", width: "3rem" }}
            />
          </span>
          <span className="direction mt-3">
            <b style={{ color: "white" }}>Directions</b>
            <SelectDropdown
              title=""
              items={directionsOption}
              handleSelect={handleDirectionChange}
              styles={{ display: "inline", width: "3rem" }}
            />
          </span>
        </div>
      </div>
      <div>
        <table className={styles.table}>
          <tr>
            <th className={`${styles.tableHeader} ${styles.th}`}>No</th>
            <th className={`${styles.tableHeader} ${styles.th}`}>Year</th>
            <th className={`${styles.tableHeader} ${styles.th}`}>Questions</th>
            <th className={`${styles.tableHeader} ${styles.th}`}>Option 'A'</th>
            <th className={`${styles.tableHeader} ${styles.th}`}>Option 'B'</th>
            <th className={`${styles.tableHeader} ${styles.th}`}>Option 'C'</th>
            <th className={`${styles.tableHeader} ${styles.th}`}>Option 'D'</th>
            <th className={`${styles.tableHeader} ${styles.th}`}>Answer</th>
            <th className={`${styles.tableHeader} ${styles.th}`}>
              Description
            </th>
            <th className={`${styles.tableHeader} ${styles.th}`}>
              Question Image
            </th>
            <th className={`${styles.tableHeader} ${styles.th}`}>
              DescriptionImage Image
            </th>
            <th className={`${styles.tableHeader} ${styles.th}`}>Manage</th>
          </tr>
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
                    style={{ width: "130px", height: "60px" }}
                    src={
                      resolveImageURL(question.questionImage || "") ||
                      placeholderImage
                    }
                  />
                </td>
                <td className={styles.td}>
                  {" "}
                  <img
                    style={{ width: "130px", height: "60px" }}
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
                    <button className={styles.label}>Edit</button>
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
