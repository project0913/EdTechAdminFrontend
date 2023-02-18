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
import { resolveImageURL } from "../../utils/helper";
import ReactPaginate from "react-paginate";

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
  const [yearOptions, setYearOptions] = useState<SelectOption[]>([]);
  const [courseOptions, setCourseOptions] = useState<SelectOption[]>([]);
  const [totalCount, setTotalCount] = useState<number | string>(0);
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
  return (
    <div>
      <div className={styles.adminBody}>
        <span className={styles.adminSelect}>
          <b style={{ color: "white", fontSize:"14px" }}>Select Course</b>
          <SelectDropdown
            title=""
            items={courseOptions}
            handleSelect={handleSelectCourse}
            styles={{ display: "inline", width: "4rem" }}
          />
        </span>
        <span>
          <b style={{ color: "white" }}>Select Year</b>
          <SelectDropdown
            title=""
            items={yearOptions}
            handleSelect={handleSelectYear}
            styles={{ display: "inline", width: "3rem" }}
          />
        </span>
      </div>

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
          <th className={`${styles.tableHeader} ${styles.th}`}>Description</th>
          <th className={`${styles.tableHeader} ${styles.th}`}>
            question Image
          </th>
          <th className={`${styles.tableHeader} ${styles.th}`}>
            DescriptionImage Image
          </th>
          <th className={`${styles.tableHeader} ${styles.th}`}>Manage</th>
        </tr>
        {questions.length > 0
          ? questions.map((question, index) => (
              <tr className={styles.tr} key={index}>
                <td className={`${styles.td} ${styles.tdNo}` }>{question.questionNumber}</td>
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
                  <Link to={"/admin-user/edit-plain-question"} state={{ question }}>
                    <button className={styles.label}>Edit</button>
                  </Link>
                  <button className={styles.label1}>Delete</button>
                </td>
              </tr>
            ))
          : "Loading..."}
      </table>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={() => {}}
        pageRangeDisplayed={5}
        pageCount={7}
        previousLabel="< previous"
      />
    </div>
  );
}
