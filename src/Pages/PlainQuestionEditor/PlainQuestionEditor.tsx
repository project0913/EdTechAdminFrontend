import { CSSProperties, useEffect, useState } from "react";
import placeholderImage from "../../assets/place_holder.jpg";
import styles from "./plainQuestionEditor.module.css";
import 'react-quill/dist/quill.snow.css';
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import Editor from "../../quill/Editor";
import { PlainQuestion } from "../../models/question.model";
import { AxiosError } from "axios";
import { FadeLoader } from "react-spinners";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { useLocation, useNavigate } from "react-router-dom";
import { resolveImageURL, showSuccessToast } from "../../utils/helper";
import {
  updateGroupedQuestionToServer,
  updatePlainQuestionToServer,
} from "../../DataService/editQuestion.service";

const override: CSSProperties = {
  margin: "10 auto",
  borderColor: "red",                                                                             
};

export default function PlainQuestionEditor() {
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
  const [question, setQuestion] = useState<PlainQuestion>();
  const [loading, setLoading] = useState(false);
  const [isGroupedQuestion, setIsGroupedQuestion] = useState(false);
  const [questionId, setQuestionId] = useState<string>("");
  const [directionId, setDirectionId] = useState<string>("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [year, setYear] = useState("2015");
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
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const answerOptions: SelectOption[] = [
    { label: "A", value: "option_a" },
    { label: "B", value: "option_b" },
    { label: "C", value: "option_c" },                             
    { label: "D", value: "option_d" },
  ];

  useEffect(() => {
    let editableQuestion = location.state.question as PlainQuestion;
    populateForm(editableQuestion);
    setQuestion(editableQuestion);
    if (editableQuestion.direction && editableQuestion.direction.length > 0) {
      setIsGroupedQuestion(true);
      setDirectionId(editableQuestion.direction);
    }
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
  const updatePlainQuestionToBackend = async (e: any) => {
    e.preventDefault();
    setLoading((prev) => true);
    setErrorMessage("");
    let editedQuestion: PlainQuestion = {
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
    console.log("question image 000001");
    console.log(editedQuestion);
    let result = null;
    if (!isGroupedQuestion) {
      result = await updatePlainQuestionToServer(
        questionId || "",
        editedQuestion,
        questionImage,
        descriptionImage
      );
    } else {
      //update grouped question
      editedQuestion.direction = directionId;
      result = await updateGroupedQuestionToServer(
        questionId || "",
        editedQuestion,
        questionImage,
        descriptionImage
      );
    }
    setLoading((prev) => false);
    if (result instanceof AxiosError) {
      let msgTxt = "";
      const messages = result.response?.data?.message as Array<string>;
      for (const msg of messages) msgTxt += msg + " "; //concatenate array of error messages
      setErrorMessage(msgTxt);
      setShowErrorToast(true);
    } else {
      showSuccessToast('updated success');
      // clearForm();
    }
  };

  const populateForm = (question: PlainQuestion) => {
    setQuestionId(question._id || "");
    setSelectedCourse(question.course || "");
    setQuestionText(question.questionText);
    setOption_a(question.option_a);
    setOption_b(question.option_b);
    setOption_c(question.option_c);
    setOption_d(question.option_d);
    setQuestionNumber(question.questionNumber);
    setYear(question.year.toString());
    setDescription(question.description);
    setQuestionImage(question.questionImage || "");
    setDescriptionImage(question.descriptionImage || "");
    console.log("this is desc from server" + question.descriptionImage);
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

      <div style={{backgroundColor:"red"}} className={styles.bodyPlainQuestion}> 
      <div className={styles.plainQuestionContainer}>
        {errorMessage.length > 0 && (
          <p style={{ color: "red" }}>{errorMessage}</p>
        )}

        <div className="">
          <div className={styles.editorContainer}>
            <h6>Question Number</h6>
            <input
              type="number"
              value={questionNumber}
              onChange={(e) => setQuestionNumber(parseInt(e.target.value))}
            />
          </div>
          <div className="">
            <div className="">
              <p>Paste your question here</p>
              <Editor
                setValue={setQuestionTextValue}
                editorId="editor1"
                value={questionText}
              />
            </div>
            <div className="">
              <p>
                <strong>select Image if the Question has Image</strong>
              </p>
              <img
                src={
                  resolveImageURL(question?.questionImage || "") ||
                  tempQuestionImagePath ||
                  placeholderImage
                }
                id="photo"
                className="img"
              />
              <input
                type="file"
                id="file"
                onChange={handleQuestionImageChange}
              />
            </div>
            <div className="">
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
            <div className="">
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
            <div className="">
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
            <div className="">
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
            <div className="">
              <p>choose Answer here</p>
              <SelectDropdown
                title=""
                items={answerOptions}
                handleSelect={setOption_answer_Text}
              />
            </div>

            <div className="">
              <b>Edit Year</b>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            <div className="">
              <p>Paste your option Description here</p>
              <Editor
                setValue={setDescription_Text}
                editorId="editor6"
                value={description}
              />
            </div>
            <div className="">
              <p>
                {" "}
                <strong>select Image if the description has Image</strong>
              </p>
              <img
                src={
                  resolveImageURL(question?.descriptionImage || "") ||
                  tempDescriptionImagePath ||
                  placeholderImage
                }
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
          
          <div className="submit-butt mb-3 mt-3">
            <button
              className="btn btn-primary btn-lg"
              onClick={updatePlainQuestionToBackend}
            >
              update
            </button>
            <button
              style={{ marginLeft: "200px" }}
              className="btn btn-warning btn-lg ml-3"
              onClick={() => {
                navigate(-1);
              }}
            >
              Back To View Questions
            </button>
          </div>
        </div>
      </div>
      </div>
    </LoadingOverlayWrapper>
  );
}
