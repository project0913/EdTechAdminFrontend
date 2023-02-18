import { CSSProperties, useEffect, useState } from "react";
import placeholderImage from "../../assets/place_holder.jpg";
import "./plainquestiondata.css";
import "react-quill/dist/quill.snow.css";
import { fetchExamCategories } from "../../DataService/fetchExamCatagories.service";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import { fetchExamSubCategories } from "../../DataService/fetchSubExamCategory";
import Editor from "../../quill/Editor";
import { PlainQuestion } from "../../models/question.model";
import { submitPlainQuestionToServer } from "../../DataService/submit-questions.service";
import { AxiosError } from "axios";
import { FadeLoader } from "react-spinners";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { toast } from "react-toastify";

import { yearsOptions } from "../../constants";
import { showErrorToast, showSuccessToast } from "../../utils/helper";

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
  const [questionNumber, setQuestionNumber] = useState<number | any>();

  const [show, setShow] = useState(false);
  const answerOptions: SelectOption[] = [
    { label: "A", value: "option_a" },
    { label: "B", value: "option_b" },
    { label: "C", value: "option_c" },
    { label: "D", value: "option_d" },
  ];
  async function fetchInitialFromServer() {
    let data = await fetchExamCategories();
    let examCatsOption = [];
    for (const examCat of data) {
      examCatsOption.push({ label: examCat.name, value: examCat._id });
    }
    setExamCatagories(examCatsOption);
    setSelectedExamCategory(data[0]._id);

    let coursesOption = [];
    for (const course of data[0].courses) {
      coursesOption.push({ label: course.name, value: course._id });
    }
    setCourses(coursesOption);
    setSelectedCourse(coursesOption[0].value);

    const subExamCats = await fetchExamSubCategories(data[0]._id);
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

      questionNumber,
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
      <div className="plain-question-bg-kulli">
        {errorMessage.length > 0 && (
          <p style={{ color: "red" }}>{errorMessage}</p>
        )}
        <div className="plain-question">
          <div className="exam-category">
            <SelectDropdown
              title="Exam Category"
              items={examCatagories}
              handleSelect={handleExamCategoryChange}
            />
          </div>
          <div className="course-selection">
            <SelectDropdown
              title="Courses"
              items={courses}
              handleSelect={handleCourseChange}
            />
          </div>
          <div className="subCategory">
            <SelectDropdown
              title="Sub Category"
              items={subExamCategory}
              handleSelect={handleSubExamCategoryChange}
            />
          </div>
          <div className="editor-container">
            <h6>Question Number</h6>
            <input
              type="number"
              value={questionNumber}
              onChange={(e) => setQuestionNumber(parseInt(e.target.value))}
            />
          </div>
          <div className="kulli">
            <div className="editor-container">
              <p>Paste your question here</p>
              <Editor
                setValue={setQuestionTextValue}
                editorId="editor1"
                value={questionText}
              />
            </div>
            <div className="editor-container">
              <p>
                <strong>select Image if the Question has Image</strong>
              </p>
              <img
                src={tempQuestionImagePath || placeholderImage}
                id="photo"
                className="img"
              />
              <input
                type="file"
                id="file"
                onChange={handleQuestionImageChange}
              />
            </div>
            <div className="editor-container">
              <p>
                Paste your option{"  "}
                <span style={{ color: "red", fontWeight: "bolder" }}> A </span>
                here
              </p>
              <Editor
                setValue={setOption_a_Text}
                editorId="editor2"
                value={option_a}
              />
            </div>
            <div className="editor-container">
              <p>
                Paste your option{" "}
                <span style={{ color: "red", fontWeight: "bolder" }}>B</span>{" "}
                here
              </p>
              <Editor
                setValue={setOption_b_Text}
                editorId="editor3"
                value={option_b}
              />
            </div>
            <div className="editor-container">
              <p>
                Paste your option{" "}
                <span style={{ color: "red", fontWeight: "bolder" }}>C</span>{" "}
                here
              </p>
              <Editor
                setValue={setOption_c_Text}
                editorId="editor4"
                value={option_c}
              />
            </div>
            <div className="editor-container">
              <p>
                Paste your option{" "}
                <span style={{ color: "red", fontWeight: "bolder" }}>D</span>{" "}
                here
              </p>
              <Editor
                setValue={setOption_d_Text}
                editorId="editor5"
                value={option_d}
              />
            </div>
            <div className="editor-container">
              <p>choose Answer here</p>
              <SelectDropdown
                title=""
                items={answerOptions}
                handleSelect={setOption_answer_Text}
              />
            </div>

            <div className="exam-category">
              <b>select Year</b>
              <SelectDropdown
                title=""
                items={yearsOptions}
                handleSelect={handleYearsChange}
              />
            </div>

            <div className="editor-container">
              <p>Paste your option Description here</p>
              <Editor
                setValue={setDescription_Text}
                editorId="editor6"
                value={description}
              />
            </div>
            <div className="editor-container">
              <p>
                {" "}
                <strong>select Image if the description has Image</strong>
              </p>
              <img
                src={tempDescriptionImagePath || placeholderImage}
                id="photo"
                className="img"
              />
              <input
                type="file"
                id="file"
                onChange={handleDescriptionImageChange}
              />
            </div>
          </div>
          <div className="toast-container"></div>

          <div className="submit-butt mb-3 mt-3">
            <button
              className="btn btn-primary btn-lg"
              onClick={submitGroupedQuestionToBackend}
            >
              submit
            </button>
          </div>
        </div>
      </div>
    </LoadingOverlayWrapper>
  );
}
