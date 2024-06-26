import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import styles from "./exercise.module.css";
import { CSSProperties, useEffect, useState } from "react";
import { Editor } from "../../quill/Editor";

import { AxiosError } from "axios";

import { showErrorToast, showSuccessToast } from "../../utils/helper";

import ErrorComponent from "../../components/ErrorComponent";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { FadeLoader } from "react-spinners";
import { fetchExamCategories } from "../../DataService/fetchExamCatagories.service";
import { ExerciseQuestion } from "../../models/exerciseQuestion.model";
import {
  answerOptions,
  gradeOptions,
  chapterOptions as co,
} from "../../constants";
import {
  getAvailableExerciseFromServer,
  submitExerciseQuestionToServer,
} from "../../DataService/exercise.service";
import placeholderImage from "../../assets/place_holder.jpg";

import "react-quill/dist/quill.snow.css";

const override: CSSProperties = {
  margin: "10 auto",
  borderColor: "red",
};

export default function ExerciseQuestionPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("9");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("1");
  const [courses, setCourses] = useState<SelectOption[]>([]);

  let [loading, setLoading] = useState(false);

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
  const [questionNumber, setQuestionNumber] = useState<string | any>("");
  const [chapterOptions] = useState<SelectOption[]>(co);

  const [show, setShow] = useState(false);
  const answerOptions: SelectOption[] = [
    { label: "A", value: "option_a" },
    { label: "B", value: "option_b" },
    { label: "C", value: "option_c" },
    { label: "D", value: "option_d" },
  ];

  async function fetchInitialFromServer() {
    let data = await fetchExamCategories();
    let coursesOption = [];
    console.log("hello ", data);
    const UEECourses = data.find((c) => c._id === "63a2ecdeee469ea43cdacbac");
    for (const course of UEECourses?.courses ?? []) {
      coursesOption.push({ label: course.name, value: course._id });
    }
    setCourses(coursesOption);
    setSelectedCourse(coursesOption[0].value);
    setSelectedGrade(gradeOptions[0].value);
    setSelectedChapter(chapterOptions[0].value.toString());
  }

  useEffect(() => {
    fetchInitialFromServer();
  }, []);

  function handleQuestionImageChange(e: any) {
    console.log(e.target.files);
    setTempQuestionImagePath(URL.createObjectURL(e.target.files[0]));
    setQuestionImage(e.target.files[0]);
  }

  useEffect(() => {}, []);

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
  const setOption_answer_Text = (e: any) => {
    setAnswerText(e.target.value);
  };
  const setDescription_Text = (val: string) => {
    setDescription(val);
  };

  const submitExerciseQuestionPageToBackend = async (e: any) => {
    e.preventDefault();
    setLoading((prev) => true);
    setErrorMessage("");
    let exercise: ExerciseQuestion = {
      questionText,
      option_a: option_a,
      option_b: option_b,
      option_c: option_c,
      option_d: option_d,
      answer: answerText,
      description: description,
      questionNumber: questionNumber,
      courseId: selectedCourse,
      grade: parseInt(selectedGrade),
      chapter: parseInt(selectedChapter),
    };

    let result = await submitExerciseQuestionToServer(exercise);
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
      showSuccessToast("Request Success ");
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
  const handleCourseChange = (e: any) => {
    setSelectedCourse(e.target.value);
  };
  const handleGradeChange = (e: any) => {
    setSelectedGrade(e.target.value);
  };
  const handleExerciseChange = (e: any) => {
    setSelectedChapter(e.target.value);
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
      <div className={styles.exerciseBackground}>
        <div className={styles.exerciseHeader}>
          <div className={styles.dropDown}>
            <SelectDropdown
              title=""
              items={courses}
              value={selectedCourse}
              handleSelect={handleCourseChange}
            />
            <SelectDropdown
              title=""
              items={gradeOptions}
              value={selectedGrade}
              handleSelect={handleGradeChange}
            />
            <SelectDropdown
              title=""
              items={chapterOptions}
              value={selectedChapter}
              handleSelect={handleExerciseChange}
            />
          </div>
        </div>
        <div>
          <div className={styles.generalBackground}>
            <div className={styles.generalHeader}>
              {errorMessage.length > 0 && (
                <span style={{ color: "red", fontSize: 24 }}>
                  {errorMessage}
                </span>
              )}
            </div>
            <div className="">
              <div>
                <p className={styles.txt}>Question Number</p>
                <input
                  type="number"
                  value={questionNumber}
                  onChange={(e) => setQuestionNumber(parseInt(e.target.value))}
                />{" "}
                <br />
                <ErrorComponent value={questionNumber} />
              </div>
              <p className={styles.txt}>Paste your question here</p>
              <Editor
                setValue={setQuestionTextValue}
                editorId="editor1"
                value={questionText}
              />
              <ErrorComponent value={questionText} />
            </div>
            <div className="">
              <p className={styles.txt}>
                Select Image if the Question has Image
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
            <div className="">
              <p className={styles.txt}>
                Paste your option
                <span style={{ color: "red", fontWeight: "bolder" }}> A </span>
                Here
              </p>
              <Editor
                setValue={setOption_a_Text}
                value={option_a}
                editorId="editor2"
              />
              <ErrorComponent value={option_a} />
            </div>
            <div className="">
              <p className={styles.txt}>
                Paste your option
                <span style={{ color: "red", fontWeight: "bolder" }}>
                  B
                </span>{" "}
                Here
              </p>
              <Editor
                setValue={setOption_b_Text}
                value={option_b}
                editorId="editor3"
              />
              <ErrorComponent value={option_b} />
            </div>
            <div className="">
              <p className={styles.txt}>
                Paste your option{" "}
                <span style={{ color: "red", fontWeight: "bolder" }}>C</span>{" "}
                Here
              </p>
              <Editor
                setValue={setOption_c_Text}
                value={option_c}
                editorId="editor4"
              />
              <ErrorComponent value={option_c} />
            </div>
            <div className="">
              <p className={styles.txt}>
                Paste your option{" "}
                <span style={{ color: "red", fontWeight: "bolder" }}>D</span>{" "}
                Here
              </p>
              <Editor
                setValue={setOption_d_Text}
                value={option_d}
                editorId="editor5"
              />
              <ErrorComponent value={option_d} />
              {/* <div className={styles.answerYear}>
                <div>
                  <b className={styles.txt}>Choose Answer here</b>
                  <SelectDropdown
                    title=""
                    items={answerOptions}
                    handleSelect={setOption_answer_Text}
                  />
                </div>
              </div> */}
              <div className={styles.answerYear}>
                <div>
                  <b
                    className={styles.txt}
                    style={{ fontWeight: "bold", color: "blue" }}
                  >
                    Choose Answer Here
                  </b>

                  <SelectDropdown
                    title=""
                    items={answerOptions}
                    value={answerText}
                    handleSelect={setOption_answer_Text}
                  />
                </div>
              </div>

              <div className={styles.plainTxt}>
                <p className={styles.txt}>Paste your option Description here</p>
                <Editor
                  setValue={setDescription_Text}
                  editorId="editor6"
                  value={description}
                />
              </div>
              <div className={styles.plainTxt}>
                <p className={styles.txt}>
                  <strong>Select Image if the description has Image</strong>
                </p>
                <img
                  src={tempDescriptionImagePath || placeholderImage}
                  className={styles.img}
                />
                <input
                  type="file"
                  id="file"
                  onChange={handleDescriptionImageChange}
                  className={styles.plainTxt}
                />
              </div>
            </div>
            <div className={styles.questionBtn}>
              <button
                className={styles.submitBtn}
                onClick={submitExerciseQuestionPageToBackend}
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
    </LoadingOverlayWrapper>
  );
}
