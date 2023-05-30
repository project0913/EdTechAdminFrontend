import { CSSProperties, useEffect, useState } from "react";
import placeholderImage from "../../assets/place_holder.jpg";
import styles from "./plainquestiondata.module.css";
import "react-quill/dist/quill.snow.css";
import { fetchExamCategories } from "../../DataService/fetchExamCatagories.service";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import { fetchExamSubCategories } from "../../DataService/fetchSubExamCategory";

import { PlainQuestion } from "../../models/question.model";
import { submitPlainQuestionToServer } from "../../DataService/submit-questions.service";
import { AxiosError } from "axios";
import { FadeLoader } from "react-spinners";
import LoadingOverlayWrapper from "react-loading-overlay-ts";

import { yearsOptions } from "../../constants";
import { showErrorToast, showSuccessToast } from "../../utils/helper";
import { Editor } from "../../quill/Editor";
import ErrorComponent from "../../components/ErrorComponent";
import { Course } from "../../models/exam-catagory.model";

//import { showErrorToast, showSuccessToast } from "../../utils/helper";
const override: CSSProperties = {
  margin: "10 auto",
  borderColor: "red",
};

export default function PlainQuestionData() {
  const [errorMessage, setErrorMessage] = useState("");
  let [loading, setLoading] = useState(false);
  const [examCatagories, setExamCatagories] = useState<SelectOption[]>([]);
  const [selectedExamCategory, setSelectedExamCategory] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSubExamCategory, setSelectedSubExamCategory] = useState("");
  const [year, setYear] = useState("2015");
  const [courses, setCourses] = useState<SelectOption[]>([]);
  const [subExamCategory, setSubExamCategory] = useState<SelectOption[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [option_a, setOption_a] = useState("");
  const [option_b, setOption_b] = useState("");
  const [option_c, setOption_c] = useState("");
  const [option_d, setOption_d] = useState("");
  const [description, setDescription] = useState("");
  const [answerText, setAnswerText] = useState("option_a");

  const [questionImage, setQuestionImage] = useState("");
  const [descriptionImage, setDescriptionImage] = useState("");
  const [tempQuestionImagePath, setTempQuestionImagePath] = useState("");
  const [tempDescriptionImagePath, setTempDescriptionImagePath] = useState("");
  const [questionNumber, setQuestionNumber] = useState<string | any>(1);

  const [show, setShow] = useState(false);
  const answerOptions: SelectOption[] = [
    { label: "A", value: "option_a" },
    { label: "B", value: "option_b" },
    { label: "C", value: "option_c" },
    { label: "D", value: "option_d" },
  ];
  useEffect(() => {
    console.log("plain question text  onInit" + questionText);
    console.log("plain questionNumber on init " + questionNumber);
  }, []);
  async function fetchInitialFromServer() {
    let data = await fetchExamCategories();
    let examCatsOption = [];
    for (const examCat of data) {
      examCatsOption.push({ label: examCat.name, value: examCat._id });
    }
    setExamCatagories(examCatsOption.reverse());
    let UEECourses = data.find((e) => e._id == "63a2ecdeee469ea43cdacbac");
    let courses: Course[] = [];
    if (UEECourses) courses = UEECourses.courses;
    let crs: SelectOption[] = [];

    for (const course of courses) {
      if (course.hasDirections) continue;

      crs.push({ label: course.name, value: course._id });
    }
    setSelectedExamCategory(UEECourses?._id || "");

    let coursesOption = [];
    for (const course of data[0].courses) {
      coursesOption.push({ label: course.name, value: course._id });
    }
    setCourses(crs);
    setSelectedCourse(crs[0].value.toString());

    const subExamCats = await fetchExamSubCategories(UEECourses?._id || "");
    setSubExamCategory(subExamCats);
    setSelectedSubExamCategory(subExamCats[0].value);
  }

  useEffect(() => {
    fetchInitialFromServer();
  }, []);
  const handleExamCategoryChange = (e: any) => {
    //TODO:
  };
  const handleCourseChange = (e: any) => {
    setSelectedCourse(e.target.value);
  };
  const handleSubExamCategoryChange = (e: any) => {
    setSelectedSubExamCategory(e.target.value);
  };
  const handleYearsChange = (e: any) => {
    setYear(e.target.value);
  };
  function handleQuestionImageChange(e: any) {
    console.log(e.target.files);
    setTempQuestionImagePath(URL.createObjectURL(e.target.files[0]));
    setQuestionImage(e.target.files[0]);
  }
  function handleDescriptionImageChange(e: any) {
    console.log(e.target.files);
    setTempDescriptionImagePath(URL.createObjectURL(e.target.files[0]));
    setDescriptionImage(e.target.files[0]);
  }
  const setQuestionTextValue = (val: string) => {
    console.log("value of Question Text after change " + val);
    console.log(
      "value of Question Number Is NAn  " + Number.isNaN(questionNumber)
    );
    setQuestionText(val);
  };
  const setOption_a_Text = (val: string) => {
    setOption_a(val);
  };
  const setOption_b_Text = (val: string) => {
    setOption_b(val);
  };
  const setOption_c_Text = (val: string) => {
    setOption_c(val);
  };
  const setOption_d_Text = (val: string) => {
    setOption_d(val);
  };
  const setOption_answer_Text = (e: any) => {
    setAnswerText(e.target.value);
  };
  const setDescription_Text = (val: string) => {
    setDescription(val);
  };
  const submitGroupedQuestionToBackend = async (e: any) => {
    e.preventDefault();
    setLoading((prev) => true);
    setErrorMessage("");
    showErrorToast();
    let question: PlainQuestion = {
      questionText,
      option_a: option_a,
      option_b: option_b,
      option_c: option_c,
      option_d: option_d,
      answer: answerText,
      description: description,
      course: selectedCourse,
      year: year,

      questionNumber: parseInt(questionNumber),
    };
    console.log("question image 00");
    console.log(questionImage);

    let result = await submitPlainQuestionToServer(
      question,
      questionImage,
      descriptionImage
    );
    setLoading((prev) => false);
    if (result instanceof AxiosError) {
      let msgTxt = "";
      const messages =
        result.response?.data?.message ||
        (["something is wrong try again Later"] as Array<string>);
      for (const msg of messages) msgTxt += msg + " "; //concatenate array of error messages
      setErrorMessage(msgTxt);
      showErrorToast();
    } else {
      setShow(true);
      showSuccessToast("request success ");
      clearForm();
    }
  };
  const clearForm = () => {
    setQuestionText("");
    setOption_a("");
    setOption_b("");
    setOption_c("");
    setOption_d("");
    const quesNum = parseInt(questionNumber || 0);
    setQuestionNumber(quesNum + 1);
    setDescription("");
    setQuestionImage("");
    setDescriptionImage("");
    setTempQuestionImagePath("");
    setTempDescriptionImagePath("");
  };

  return (
    <LoadingOverlayWrapper
      active={loading}
      spinner={
        <FadeLoader
          loading={loading}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      }
    >
      <div>
        <div className={styles.plainQuestion}></div>
        <div className={styles.all}>
          <div className={styles.bgDrop}>
            <div className={styles.dropdownItemPlain}>
              <div>
                <b className={styles.adminTopText}>Exam Category</b>
                <SelectDropdown
                  title=""
                  items={examCatagories}
                  handleSelect={handleExamCategoryChange}
                />
              </div>
              <div className="course-selection">
                <b className={styles.adminTopText}>Courses</b>
                <SelectDropdown
                  title=""
                  items={courses}
                  handleSelect={handleCourseChange}
                />
              </div>
              <div className="subCategory">
                <b className={styles.adminTopText}>Sub Category</b>
                <SelectDropdown
                  title=""
                  items={subExamCategory}
                  handleSelect={handleSubExamCategoryChange}
                />
              </div>
            </div>
          </div>

          <div className={styles.adminBodyQuestion}>
            <div className={styles.overAllBody}>
              <div className={styles.plainQuestionInsert1}>
                <div className={styles.inp}></div>

                <div className={styles.txtEditor}>
                  <div
                    className={styles.yearQuestion}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className={styles.dropdownItem}>
                      <b>Select Year</b>
                      <SelectDropdown
                        title=""
                        items={yearsOptions}
                        handleSelect={handleYearsChange}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "20px",
                      }}
                    >
                      <p className={styles.txt} style={{ marginRight: "10px" }}>
                        Question Number
                      </p>
                      <input
                        type="number"
                        value={questionNumber}
                        onChange={(e) =>
                          setQuestionNumber(parseInt(e.target.value))
                        }
                        style={{
                          marginRight: "10px",
                          height: "23px",
                          textAlign: "center",
                        }}
                      />
                      <ErrorComponent value={questionNumber} />
                    </div>
                  </div>
                  <div className={styles.q}>
                    <p className={styles.txt}>Paste Your Question Here</p>
                    <Editor
                      setValue={setQuestionTextValue}
                      value={questionText}
                      editorId="editor1"
                    />
                    <ErrorComponent value={questionText} />
                  </div>

                  <div
                    className={styles.plainImage}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <p className={styles.txt}>
                      Select Image if the Question has Image
                    </p>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={tempQuestionImagePath || placeholderImage}
                        id="photo"
                        className={styles.img}
                        style={{ marginRight: "10px" }}
                      />
                      <label htmlFor="file" className={styles.chooseFileButton}>
                        <span>Choose File</span>
                        <input
                          type="file"
                          id="file"
                          onChange={handleQuestionImageChange}
                          className={styles.plainTxt}
                          style={{ display: "none" }}
                        />
                      </label>
                      <span className={styles.txt}>
                        {tempQuestionImagePath ? "No file chosen" : ""}
                      </span>
                    </div>
                  </div>
                  <div className={styles.plainTxt}>
                    <p className={styles.txt}>
                      Paste Your Option{"  "}
                      <span style={{ color: "red", fontWeight: "bolder" }}>
                        A{" "}
                      </span>
                      here
                    </p>
                    <Editor
                      setValue={setOption_a_Text}
                      value={option_a}
                      editorId="editor2"
                    />
                    <ErrorComponent value={option_a} />
                  </div>
                  <div className={styles.plainTxt}>
                    <p className={styles.txt}>
                      Paste Your ption{" "}
                      <span style={{ color: "red", fontWeight: "bolder" }}>
                        B
                      </span>{" "}
                      here
                    </p>
                    <Editor
                      setValue={setOption_b_Text}
                      value={option_b}
                      editorId="editor3"
                    />
                    <ErrorComponent value={option_b} />
                  </div>
                  <div className={styles.plainTxt}>
                    <p className={styles.txt}>
                      Paste Your Option{" "}
                      <span style={{ color: "red", fontWeight: "bolder" }}>
                        C
                      </span>{" "}
                      Here
                    </p>
                    <Editor
                      setValue={setOption_c_Text}
                      value={option_c}
                      editorId="editor4"
                    />
                    <ErrorComponent value={option_c} />
                  </div>
                  <div className={styles.plainTxt}>
                    <p className={styles.txt}>
                      Paste your option{" "}
                      <span style={{ color: "red", fontWeight: "bolder" }}>
                        D
                      </span>{" "}
                      here
                    </p>
                    <Editor
                      setValue={setOption_d_Text}
                      value={option_d}
                      editorId="editor5"
                    />
                    <ErrorComponent value={option_d} />
                  </div>
                  <div className={styles.answerYear}>
                    <div>
                      <b className={styles.txt}>Choose Answer Here</b>
                      <SelectDropdown
                        title=""
                        items={answerOptions}
                        handleSelect={setOption_answer_Text}
                      />
                    </div>
                  </div>

                  <div className={styles.plainTxt}>
                    <p className={styles.txt}>
                      Paste Your Option Description Here
                    </p>
                    <Editor
                      setValue={setDescription_Text}
                      editorId="editor6"
                      value={description}
                    />
                  </div>
                  <div className={styles.plainTxt}>
                    <p className={styles.txt}>
                      Select Image if the Description has Image
                    </p>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={tempDescriptionImagePath || placeholderImage}
                        className={styles.img}
                        style={{ marginRight: "10px" }}
                      />
                      <label htmlFor="file" className={styles.chooseFileButton}>
                        <span>Choose File</span>
                        <input
                          type="file"
                          id="file"
                          onChange={handleDescriptionImageChange}
                          className={styles.plainTxt}
                          style={{ display: "none" }}
                        />
                      </label>
                      <span className={styles.txt}>
                        {tempDescriptionImagePath ? "No file chosen" : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className={styles.questionBtn}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <button
                    className={styles.submitBtn}
                    onClick={submitGroupedQuestionToBackend}
                  >
                    Submit
                  </button>
                  <button className={styles.clearBtn} onClick={clearForm}>
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlayWrapper>
  );
}
