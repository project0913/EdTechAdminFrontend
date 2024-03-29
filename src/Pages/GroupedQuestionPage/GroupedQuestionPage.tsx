import styles from "./groupedquestionpage.module.css";
import { useState, useEffect, useRef, CSSProperties } from "react";
import placeholderImage from "../../assets/place_holder.jpg";
// hello
import { AxiosError } from "axios";
import { SelectOption } from "../../DataService/service.types";
import { PlainQuestion as GroupedQuestion } from "../../models/question.model";
import SelectDropdown from "../../components/SelectDropdown";

import {
  fetchGroupedCourses,
  fetchGroupedCoursesDirectionYears,
  fetchDirectionOfCourseByYear,
} from "../../DataService/fetchCourse.service";
import { submitGroupedQuestionToServer } from "../../DataService/submit-questions.service";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { FadeLoader } from "react-spinners";
import { showErrorToast, showSuccessToast } from "../../utils/helper";
import { Editor } from "../../quill/Editor";
import ErrorComponent from "../../components/ErrorComponent";
const override: CSSProperties = {
  margin: "10 auto",
  borderColor: "red",
};

export default function GroupedQuestionPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [progressMessage, setProgressMessage] = useState("");
  let [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<SelectOption[]>([]);
  const [directions, setDirections] = useState<SelectOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [years, setYears] = useState<SelectOption[]>([]);
  const [selectedYear, setSelectedYear] = useState("2015");
  const [selectedDirection, setSelectedDirection] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionNumber, setQuestionNumber] = useState<string | any>();
  const [option_a, setOption_a] = useState("");
  const [option_b, setOption_b] = useState("");
  const [option_c, setOption_c] = useState("");
  const [option_d, setOption_d] = useState("");
  const [description, setDescription] = useState("");
  const [answerText, setAnswerText] = useState("option_a");

  const isInitialMount = useRef(true);

  const [questionImage, setQuestionImage] = useState("");
  const [descriptionImage, setDescriptionImage] = useState("");
  const [tempQuestionImagePath, setTempQuestionImagePath] = useState("");
  const [tempDescriptionImagePath, setTempDescriptionImagePath] = useState("");
  const answerOptions: SelectOption[] = [
    { label: "A", value: "option_a" },
    { label: "B", value: "option_b" },
    { label: "C", value: "option_c" },
    { label: "D", value: "option_d" },
  ];

  useEffect(() => {
    getGroupedCourses();
  }, []);
  useEffect(() => {
    if (selectedCourse.length > 0) getGroupedCoursesYear();
  }, [selectedCourse]);
  useEffect(() => {
    if (selectedYear)
      getGroupedCoursesDirections(
        selectedCourse,
        parseInt(selectedYear.toString())
      );
  }, [selectedYear]);

  const getGroupedCourses = async () => {
    const groupedCourses = await fetchGroupedCourses();
    setCourses(groupedCourses);
    const defaultCourseId = groupedCourses[0].value;
    setSelectedCourse(defaultCourseId);
    const years = await fetchGroupedCoursesDirectionYears(defaultCourseId);
    setYears(years);
  };

  const getGroupedCoursesYear = async () => {
    //listen for course change to be called
    setProgressMessage("Loading....");
    const years = await fetchGroupedCoursesDirectionYears(selectedCourse);
    if (years.length == 0) {
      setProgressMessage("it looks like you don't have data yet");
      return;
    }
    setProgressMessage(""); // clear loading if years are loaded
    setYears(years);
    setSelectedYear(years[0].value);
  };
  const getGroupedCoursesDirections = async (
    courseId: string,
    year: number
  ) => {
    //  listen for course change to be called
    setSelectedDirection("");
    const directionsFromServer = await fetchDirectionOfCourseByYear(
      courseId,
      year
    );
    const defaultDirectionId = directionsFromServer[0].value;
    console.log(directionsFromServer);
    setSelectedDirection(defaultDirectionId);
    setDirections(directionsFromServer);
  };
  const handleCourseChange = (e: any) => {
    console.log("course change " + e.target.value);

    setSelectedCourse(e.target.value);
  };
  const handleDirectionChange = (e: any) => {
    setSelectedDirection(e.target.value);
  };
  const handleYearChange = (e: any) => {
    setSelectedYear(e.target.value);
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
  const set_answer_Text = (e: any) => {
    setAnswerText(e.target.value);
  };
  const setDescription_Text = (val: string) => {
    setDescription(val);
  };
  const submitQuestionToBackend = async (e: any) => {
    setErrorMessage(""); //make empty error message before submission
    setLoading((prev) => true);
    let question: GroupedQuestion = {
      questionText,
      option_a: option_a,
      option_b: option_b,
      option_c: option_c,
      option_d: option_d,
      answer: answerText,
      description: description,
      courseId: selectedCourse,
      year: parseInt(selectedYear),
      direction: selectedDirection,
      questionNumber: parseInt(questionNumber),
    };

    const result = await submitGroupedQuestionToServer(
      question,
      questionImage,
      descriptionImage
    );
    setLoading(false);
    if (result instanceof AxiosError) {
      let msgTxt = "";
      const messages = result.response?.data?.message as Array<string>;

      for (const msg of messages) {
        msgTxt += msg + " ";
      } // concatenate array of error messages

      if (msgTxt !== errorMessage) {
        setErrorMessage(msgTxt);
        showErrorToast(msgTxt);
      }
    } else {
      showSuccessToast("Question Inserted successfully");
      clearForm();
    }
  };
  const clearForm = () => {
    setQuestionText("");
    setOption_a("");
    setOption_b("");
    setOption_c("");
    setOption_d("");
    const quesNum = parseInt(questionNumber || 0) + 1;
    console.log(`qqqqqqqqqqqqqqqqqqqqqq ${quesNum.toString()}`);

    setQuestionNumber(quesNum.toString());
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
      <div className={styles.groupedQuestionBody}>
        <div>
          <div className={styles.groupedBg}>
            <div className={styles.dropdownItem}>
              <div className="">
                <SelectDropdown
                  title="Courses"
                  items={courses}
                  value={selectedCourse}
                  handleSelect={handleCourseChange}
                />
              </div>
              <div className="">
                <SelectDropdown
                  title="Years"
                  items={years}
                  value={selectedYear}
                  handleSelect={handleYearChange}
                />
              </div>
              <div className="">
                <SelectDropdown
                  title="Directions"
                  items={directions}
                  value={selectedDirection}
                  handleSelect={handleDirectionChange}
                />
              </div>
            </div>
          </div>
          <div className={styles.groupMargin}>
            <div className={styles.txtEditor}>
              <div className={styles.editorContainer}>
                <p
                  className={styles.txt}
                  style={{
                    fontWeight: "bold",
                    color: "green",
                    paddingTop: "20px",
                  }}
                >
                  Question Number
                </p>
                <input
                  type="number"
                  onChange={(e) => setQuestionNumber(parseInt(e.target.value))}
                  value={questionNumber}
                />
                <br />
                <ErrorComponent value={questionNumber} />
              </div>
              <div className={styles.editorContaine}>
                <div className="editor-container">
                  <p
                    className={styles.questionNumber}
                    style={{ fontWeight: "bold", color: "green" }}
                  >
                    Paste your question here
                  </p>
                  <Editor
                    setValue={setQuestionTextValue}
                    editorId="editor1"
                    value={questionText}
                  />
                  <ErrorComponent value={questionText} />
                </div>
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
                <div>
                  <p
                    className={styles.txt}
                    style={{ fontWeight: "bold", color: "green" }}
                  >
                    Paste your option{" "}
                    <span style={{ color: "blue", fontWeight: "bolder" }}>
                      A
                    </span>{" "}
                    here
                  </p>
                  <Editor
                    setValue={setOption_a_Text}
                    value={option_a}
                    editorId="editor2"
                  />
                  <ErrorComponent value={option_a} />
                </div>
                <div>
                  <p
                    className={styles.txt}
                    style={{ fontWeight: "bold", color: "green" }}
                  >
                    Paste your option{" "}
                    <span style={{ color: "blue", fontWeight: "bolder" }}>
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
                <div>
                  <p
                    className={styles.txt}
                    style={{ fontWeight: "bold", color: "green" }}
                  >
                    Paste your option{" "}
                    <span style={{ color: "blue", fontWeight: "bolder" }}>
                      C
                    </span>{" "}
                    here
                  </p>
                  <Editor
                    setValue={setOption_c_Text}
                    value={option_c}
                    editorId="editor4"
                  />
                  <ErrorComponent value={option_c} />
                </div>
                <div>
                  <p
                    className={styles.txt}
                    style={{ fontWeight: "bold", color: "green" }}
                  >
                    Paste your option{" "}
                    <span style={{ color: "blue", fontWeight: "bolder" }}>
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
                <div className={styles.answerContainer}>
                  <p
                    className={styles.txt}
                    style={{ fontWeight: "bold", color: "blue" }}
                  >
                    Choose Answer here
                  </p>
                  <SelectDropdown
                    title=""
                    value={answerText}
                    items={answerOptions}
                    handleSelect={set_answer_Text}
                  />
                </div>

                <div>
                  <p
                    className={styles.txt}
                    style={{ fontWeight: "bold", color: "green" }}
                  >
                    Paste your option Description here
                  </p>
                  <Editor
                    editorId="editor6"
                    setValue={setDescription_Text}
                    value={description}
                  />
                </div>
                <div className={styles.plainTxt}>
                  <p
                    className={styles.txt}
                    style={{ fontWeight: "bold", color: "green" }}
                  >
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
                <div
                  className={styles.questionBtn}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <button
                    className={styles.submitBtn}
                    onClick={submitQuestionToBackend}
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
