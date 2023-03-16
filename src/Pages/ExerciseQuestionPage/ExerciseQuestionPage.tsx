import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import styles from "./exercise.module.css";
import { CSSProperties, useEffect, useState } from "react";
import { Editor } from "../../quill/Editor";
import { PlainQuestion } from "../../models/question.model";
import { AxiosError } from "axios";
import { ExerciseQuestion } from "../../models/exercise.model";
import { showErrorToast, showSuccessToast } from "../../utils/helper";
import { submitPlainQuestionToServer } from "../../DataService/submit-questions.service";
import { fetchExamCategories } from "../../DataService/fetchExamCatagories.service";
import ErrorComponent from "../../components/ErrorComponent";

const override: CSSProperties = {
  margin: "10 auto",
  borderColor: "red",
};

export default function ExerciseQuestionPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState<SelectOption[]>([]);
  const [grade, setGrade] = useState<SelectOption[]>([]);

  let [loading, setLoading] = useState(false);
  const [examCatagories, setExamCatagories] = useState<SelectOption[]>([]);
  const [selectedExamCategory, setSelectedExamCategory] = useState("");

  const [selectedSubExamCategory, setSelectedSubExamCategory] = useState("");
  const [year, setYear] = useState("2015");

  const [subExamCategory, setSubExamCategory] = useState<SelectOption[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [option_a, setOption_a] = useState("");
  const [option_b, setOption_b] = useState("");
  const [option_c, setOption_c] = useState("");
  const [option_d, setOption_d] = useState("");
  const [chapter, setChapter] = useState("");
  const [exerciseNumber, setExerciseNumber] = useState("");
  const [description, setDescription] = useState("");
  const [answerText, setAnswerText] = useState("option_a");

  const [questionImage, setQuestionImage] = useState("");
  const [descriptionImage, setDescriptionImage] = useState("");
  const [tempQuestionImagePath, setTempQuestionImagePath] = useState("");
  const [tempDescriptionImagePath, setTempDescriptionImagePath] = useState("");
  const [questionNumber, setQuestionNumber] = useState<string | any>();

  const [show, setShow] = useState(false);
  const gradeOptions: SelectOption[] = [
    { label: "9 th", value: "grade_9" },
    { label: "10 th", value: "grade_10" },
    { label: "11 th", value: "grade_11" },
    { label: "12 th", value: "grade_12" },
  ];
  const answerOptions: SelectOption[] = [
    { label: "A", value: "option_a" },
    { label: "B", value: "option_b" },
    { label: "C", value: "option_c" },
    { label: "D", value: "option_d" },
  ];
  async function fetchInitialFromServer() {
    let data = await fetchExamCategories();
    let coursesOption = [];
    for (const course of data[0].courses) {
      coursesOption.push({ label: course.name, value: course._id });
    }
    setCourses(coursesOption);
    setSelectedCourse(coursesOption[0].value);
  }
  useEffect(() => {
    fetchInitialFromServer();
  }, []);
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
  const setOption_answer_Text = (e: any) => {
    setAnswerText(e.target.value);
  };
  const setDescription_Text = (val: string) => {
    setDescription(val);
  };
  const setChapter_Text = (val: string) => {
    setChapter(val);
  };
  const setExerciseNumber_Text = (val: string) => {
    setExerciseNumber(val);
  };

  const submitQuestionToBackend = async () => {
    let exercise: ExerciseQuestion = {
      course: selectedCourse,
      grade: selectedGrade,
      questionText: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      answer: "",
      description: "",
      exerciseNumber: "",
      chapter: "",
      year: "",
    };
  };
  const submitExerciseQuestionPageToBackend = async (e: any) => {
    e.preventDefault();
    setLoading((prev) => true);
    setErrorMessage("");
    showErrorToast();
    let exercise: ExerciseQuestion = {
      questionText,
      option_a: option_a,
      option_b: option_b,
      option_c: option_c,
      option_d: option_d,
      answer: answerText,
      description: description,
      course: selectedCourse,
      year: year,
      exerciseNumber: exerciseNumber,
      chapter: chapter,

      questionNumber: parseInt(questionNumber),
      grade: "",
    };
    console.log("question image 00");
    console.log(questionImage);

    let result = await submitPlainQuestionToServer(
      exercise,
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
    setExerciseNumber("");
    setChapter("");
  };
  const handleCourseChange = (e: any) => {
    setSelectedCourse(e.target.value);
  };
  const handleGradeChange = (e: any) => {
    setSelectedGrade(e.target.value);
  };

  return (
    <div className={styles.exerciseBackground}>
      <div className={styles.exerciseHeader}>
        <div className={styles.dropDown}>
          <SelectDropdown
            title=""
            items={courses}
            handleSelect={handleCourseChange}
          />
          <SelectDropdown
            title=""
            items={gradeOptions}
            handleSelect={handleGradeChange}
          />
        </div>
      </div>
      <div>
        <div className={styles.generalBackground}>
          <div className={styles.generalHeader}></div>
          <div className="">
            <div>
              <p className={styles.txt}>Paste Your Chapter Number</p>{" "}
            </div>
            <input
              type="number"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
            />

            <div>
              <p className={styles.txt}>Paste Your Exercise Number</p>{" "}
            </div>
            <input
              type="number"
              value={exerciseNumber}
              onChange={(e) => setExerciseNumber(e.target.value)}
            />

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
              <strong>Select Image if the Question has Image</strong>
            </p>
            <img
              src={tempQuestionImagePath || "place holder"}
              id="photo"
              className={styles.img}
            />
            <input type="file" id="file" onChange={handleQuestionImageChange} />
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
              <span style={{ color: "red", fontWeight: "bolder" }}>B</span> Here
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
              <span style={{ color: "red", fontWeight: "bolder" }}>C</span> Here
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
              <span style={{ color: "red", fontWeight: "bolder" }}>D</span> Here
            </p>
            <Editor
              setValue={setOption_d_Text}
              value={option_d}
              editorId="editor5"
            />
            <ErrorComponent value={option_d} />
            <div className={styles.answerYear}>
              <div>
                <b className={styles.txt}>Choose Answer here</b>
                <SelectDropdown
                  title=""
                  items={answerOptions}
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
                src={tempDescriptionImagePath || ""}
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
  );
}
