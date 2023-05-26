import { fetchAvailableYears } from "../../DataService/fetchAvailableYears.service";
import { fetchExamCategories } from "../../DataService/fetchExamCatagories.service";
import { fetchPlainQuestions } from "../../DataService/viewPlainQuestion.service";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
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
import {
  deleteGroupedQuestion,
  deletePlainQuestion,
} from "../../DataService/editQuestion.service";
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
  const viewPlainQuestionState = useContext(ViewPlainQuestionContext);
  const [questions, setQuestions] = useState<PlainQuestion[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | string>("2015");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [yearOptions, setYearOptions] = useState<SelectOption[]>([]);
  const [courseOptions, setCourseOptions] = useState<SelectOption[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [activePage, setActivePage] = useState<number>(
    viewPlainQuestionState.page > 0 ? viewPlainQuestionState.page : 0
  );
  const isInitialMount = useRef(true);
  const isInitialMount2 = useRef(true);
  const { setPlainQuestionState, ...clean } = viewPlainQuestionState;

  const onPageRestore = async () => {
    console.log("restore called.......................");
    console.log(clean);
    setActivePage(viewPlainQuestionState?.page);
    setCourseOptions(viewPlainQuestionState.courses);
    setYearOptions(viewPlainQuestionState.years);
    setSelectedCourse(viewPlainQuestionState.selectedCourse);
    setSelectedYear(viewPlainQuestionState.selectedYear);
    const { count, questions } = await fetchPlainQuestions({
      course: viewPlainQuestionState.selectedCourse,
      year: viewPlainQuestionState.selectedYear,
      page: viewPlainQuestionState.page,
    });
    setQuestions(questions);
    setTotalCount(count);
  };
  useEffect(() => {
    if (viewPlainQuestionState?.page > 0) {
      onPageRestore();
    } else {
      console.log("on init fetching courses change fetching years ");

      getCourses();
    }
    onPageChange(
      viewPlainQuestionState.page > 0 ? viewPlainQuestionState.page : 1
    );
  }, []);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // Your useEffect code here to be run on update
      console.log("selected course change fetching years ");

      getYears(selectedCourse);
    }
    // setActivePage(0);
  }, [selectedCourse]);

  useEffect(() => {
    if (isInitialMount2.current) {
      isInitialMount2.current = false;
    } else {
      getQuestions({ course: selectedCourse, year: selectedYear, page: 1 });
    }
    // setActivePage(0);
  }, [selectedYear]);

  const getCourses = async () => {
    let examCats = await fetchExamCategories();
    let UEECourses = examCats[0].courses;
    let crs: SelectOption[] = [];
    for (const course of UEECourses) {
      if (course.hasDirections) continue;

      crs.push({ label: course.name, value: course._id });
    }
    const privPageCrs =
      viewPlainQuestionState.courses.length > 0
        ? viewPlainQuestionState.courses
        : crs;
    const privSelectedCourse =
      viewPlainQuestionState.selectedCourse.length > 0
        ? viewPlainQuestionState.selectedCourse
        : UEECourses[0]._id;
    setCourseOptions((p) => privPageCrs);
    setSelectedCourse((p) => privSelectedCourse);
    await getYears(UEECourses[0]._id);
    const privSelectedPage = activePage > 0 ? activePage : 1;
    await getQuestions({
      course: selectedCourse,
      year: selectedYear,
      page: privSelectedPage,
    });
  };
  async function getYears(courseId: string | number) {
    let yearsFromServer: SelectOption[] = await fetchAvailableYears(courseId);
    const privYears =
      viewPlainQuestionState.years.length > 0
        ? viewPlainQuestionState.years
        : yearsFromServer;
    setYearOptions((p) => privYears);
    const privSelectedYear =
      viewPlainQuestionState.selectedYear.toString().length > 0
        ? viewPlainQuestionState.selectedYear
        : yearsFromServer[0].value;
    console.log("privvvvvvvvvvvvvvvv year " + privSelectedYear);

    setSelectedYear((p) => privSelectedYear);
    // if (yearsFromServer.length > 0)
  }
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
                                courses: courseOptions,
                                page: activePage > 0 ? activePage : 1,
                                selectedCourse,
                                selectedYear,
                                years: yearOptions,
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
