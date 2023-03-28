import { fetchAvailableYears } from "../../DataService/fetchAvailableYears.service";
import { fetchExamCategories } from "../../DataService/fetchExamCatagories.service";
import { fetchPlainQuestions } from "../../DataService/viewPlainQuestion.service";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import placeholderImage from "../../assets/place_holder.jpg";
import { PlainQuestion } from "../../models/question.model";
import styles from "./viewQuestionsPage.module.css";
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
import ReactPaginate from "react-paginate";
import { deleteGroupedQuestion } from "../../DataService/editQuestion.service";
import { AxiosError } from "axios";
import { Pagination } from "react-bootstrap";
import CustomPagination from "../../components/pagination";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      return <span>{domToReact(domNode.children)}</span>;
    }
  },
};

export default function ViewPlainQuestionsPage() {
  const [questions, setQuestions] = useState<PlainQuestion[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | string>("2015");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [yearOptions, setYearOptions] = useState<SelectOption[]>([]);
  const [courseOptions, setCourseOptions] = useState<SelectOption[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const isInitialMount = useRef(true);
  const getCourses = async () => {
    let examCats = await fetchExamCategories();
    let UEECourses = examCats[0].courses;
    let crs: SelectOption[] = [];
    for (const course of UEECourses) {
      if (course.hasDirections) continue;

      crs.push({ label: course.name, value: course._id });
    }
    setCourseOptions((p) => crs);
    setSelectedCourse((p) => UEECourses[0]._id);
    await getYears(UEECourses[0]._id);
    await getQuestions({ course: selectedCourse, year: selectedYear, page: 1 });
  };
  async function getYears(courseId: string | number) {
    let yearsFromServer: SelectOption[] = await fetchAvailableYears(courseId);
    setYearOptions((p) => yearsFromServer);
    if (yearsFromServer.length > 0)
      setSelectedYear((p) => yearsFromServer[0].value || 2010);
  }
  const deletePlainQuestionFromServer = async (questionId: string) => {
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
      // Your useEffect code here to be run on update
      console.log("called on update only");

      getYears(selectedCourse);
    }
  }, [selectedCourse]);

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      getQuestions({ course: selectedCourse, year: selectedYear, page: 1 });
    }
  }, [selectedYear]);

  const handleSelectYear = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedYear((e.target as HTMLSelectElement).value);
  };
  const handleSelectCourse = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelectedCourse((e.target as HTMLSelectElement).value);
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
    const { count, questions } = await fetchPlainQuestions({
      course: selectedCourse,
      year: selectedYear,
      page: 1,
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
    setQuestions(questions);
    setTotalCount(count);
  };

  return (
    <div className={styles.all}>
      <div className={styles.directionHeader}>
        <span>
          <b>Select Course</b>
          <SelectDropdown
            title=""
            items={courseOptions}
            handleSelect={handleSelectCourse}
            // styles={{ display: "inline", width: "4rem" }}
          />
        </span>
        <span>
          <b>Select Year</b>
          <SelectDropdown
            title=""
            items={yearOptions}
            handleSelect={handleSelectYear}
          />
        </span>
      </div>
      <div className={styles.allTable}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.row}>
              <th className={` ${styles.th}`}>No</th>
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
                        style={{ maxWidth: "150px", maxHeight: "80px" }}
                        src={
                          resolveImageURL(question.questionImage || "") ||
                          placeholderImage
                        }
                      />
                    </td>
                    <td className={styles.td}>
                      {" "}
                      <img
                        style={{ maxWidth: "150px", maxHeight: "80px" }}
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
                          <button className={styles.label}>Edit</button>
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
        />
      </div>
    </div>
  );
}
