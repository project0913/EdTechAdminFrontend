import styles from "./groupedquestionpage.module.css";
import { useState, useEffect, useRef, CSSProperties } from "react";
import placeholderImage from "../../assets/place_holder.jpg";

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

  async function fetchGroupedQuestionDirectionsFromServer(
    courseId?: string,
    year?: number
  ) {
    let filteringCourseId = "",
      filteringYear = 2015;
    if (!(courseId && year)) {
      //if courseId or  year not provided  fetch all from server
      const groupedCourses = await fetchGroupedCourses();
      setCourses(groupedCourses);
      const defaultCourseId = groupedCourses[0].value;
      filteringCourseId = defaultCourseId;
      setSelectedCourse(defaultCourseId);
      const years = await fetchGroupedCoursesDirectionYears(defaultCourseId);
      setYears(years);
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
    setDirections(directionsFromServer);
  }

  useEffect(() => {
    fetchGroupedQuestionDirectionsFromServer();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // Your useEffect code here to be run on update only not initial mount
      fetchGroupedQuestionDirectionsFromServer(
        selectedCourse,
        parseInt(selectedYear)
      );
    }
  }, [selectedCourse, selectedYear]);

  const handleCourseChange = (e: any) => {
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
    setLoading((prev) => false);

    if (result instanceof AxiosError) {
      let msgTxt = "";
      const messages =
        result.response?.data?.message ||
        (["something is wrong try again Later"] as Array<string>);
      for (const msg of messages) {
        msgTxt += msg + " "; //concatenate array of error messages
      }
      setErrorMessage(msgTxt);
      //Todo handle error
      showErrorToast();
    } else {
      //todo Handle success
      showSuccessToast("Request Success");
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
      <div className={styles.groupedQuestionBody}>
        <div>
          <div className={styles.groupedBg}>
            <div className={styles.groupedHeader}>
              <div className={styles.dropdownItem}>
                <div className="">
                  <SelectDropdown
                    title="Courses"
                    items={courses}
                    handleSelect={handleCourseChange}
                  />
                </div>
                <div className="">
                  <SelectDropdown
                    title="Years"
                    items={years}
                    handleSelect={handleYearChange}
                  />
                </div>
                <div className="">
                  <SelectDropdown
                    title="Directions"
                    items={directions}
                    handleSelect={handleDirectionChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.groupMargin}>
            <div className={styles.editorContainer}>
              <p>Question Number</p>
              <input
                type="number"
                onChange={(e) => setQuestionNumber(parseInt(e.target.value))}
              />
              <br />
              <ErrorComponent value={questionNumber} />
            </div>
            <div className={styles.editorContaine}>
              <div className="editor-container">
                <p className={styles.questionNumb}>Paste your question here</p>
                <Editor
                  setValue={setQuestionTextValue}
                  editorId="editor1"
                  value={questionText}
                />
                <ErrorComponent value={questionText} />
              </div>
              <div className="editor-container">
                <p>
                  <strong className={styles.questionNur}>
                    Select Image if the Question has Image
                  </strong>
                </p>

                <img
                  src={tempQuestionImagePath || placeholderImage}
                  id="photo"
                  className={styles.img}
                />
                <input
                  type="file"
                  id="file"
                  onChange={handleQuestionImageChange}
                />
              </div>
              <div>
                <p>
                  Paste your option{" "}
                  <span style={{ color: "red", fontWeight: "bolder" }}>A</span>{" "}
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
                <p>
                  Paste your option{" "}
                  <span style={{ color: "red", fontWeight: "bolder" }}>B</span>{" "}
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
                <p>
                  Paste your option{" "}
                  <span style={{ color: "red", fontWeight: "bolder" }}>C</span>{" "}
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
                <p>
                  Paste your option{" "}
                  <span style={{ color: "red", fontWeight: "bolder" }}>D</span>{" "}
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
                <p className={styles.questionAnswer}>Choose Answer here</p>
                <SelectDropdown
                  title=""
                  items={answerOptions}
                  handleSelect={set_answer_Text}
                />
              </div>

              <div>
                <p>Paste your option Description here</p>
                <Editor
                  editorId="editor6"
                  setValue={setDescription_Text}
                  value={description}
                />
              </div>
              <div>
                <p>
                  {" "}
                  <strong>Select Image if the description has Image</strong>
                </p>
                <img
                  src={tempDescriptionImagePath || placeholderImage}
                  id="photo"
                  className={styles.img}
                />
                <input
                  type="file"
                  id="file"
                  onChange={handleDescriptionImageChange}
                />
              </div>
              <div>
                <button
                  className={styles.submitBtn1}
                  onClick={submitQuestionToBackend}
                >
                  Submit
                </button>
              </div>
              {questionText}
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlayWrapper>
  );
}
