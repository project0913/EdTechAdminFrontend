import { AxiosError } from "axios";
import { CSSProperties, useState, useEffect } from "react";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import styles from "react-loading-overlay-ts/dist/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";

import ErrorComponent from "../../components/ErrorComponent";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import { ExerciseQuestion } from "../../models/exerciseQuestion.model";
import Editor from "../../quill/Editor";
import Styles from "./exerciseEditor.module.css";
import { showSuccessToast, resolveImageURL } from "../../utils/helper";
import { answerOptions } from "../../constants";
import { updateExerciseQuestionToServer } from "../../DataService/exercise.service";

import placeholderImage from "../../assets/place_holder.jpg";

import "react-quill/dist/quill.snow.css";

const override: CSSProperties = {
  margin: "10 auto",
  borderColor: "red",
};

export default function ExerciseQuestionEditorPage() {
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [questionId, setQuestionId] = useState<string>("");

  const [exerciseQuestion, setExerciseQuestion] = useState<ExerciseQuestion>();

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

  useEffect(() => {
    let editableQuestion = location.state.question as ExerciseQuestion;
    populateForm(editableQuestion);
    setExerciseQuestion(editableQuestion);
    setQuestionId(editableQuestion._id || "");
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
  const updateExerciseQuestionToBackend = async (e: any) => {
    e.preventDefault();
    setLoading((prev) => true);
    setErrorMessage("");
    let editedQuestion: ExerciseQuestion = {
      questionText,
      option_a: option_a,
      option_b: option_b,
      option_c: option_c,
      option_d: option_d,
      answer: answerText,
      description: description,
      questionNumber: parseInt(questionNumber),
    };
    console.log("question image ========================123");
    console.log(editedQuestion);

    let result = await updateExerciseQuestionToServer(
      questionId,
      editedQuestion
    );

    setLoading((prev) => false);
    if (result instanceof AxiosError) {
      let msgTxt = "";
      const messages = result.response?.data?.message as Array<string>;
      for (const msg of messages) msgTxt += msg + " "; //concatenate array of error messages
      setErrorMessage(msgTxt);
    } else {
      showSuccessToast("updated success");
      // clearForm();
    }
  };

  const populateForm = (question: ExerciseQuestion) => {
    setQuestionId(question._id || "");
    setQuestionText(question.questionText);
    setOption_a(question.option_a);
    setOption_b(question.option_b);
    setOption_c(question.option_c);
    setOption_d(question.option_d);
    setQuestionNumber(question.questionNumber);
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
      <div className={Styles.bodyPlainQuestion}>
        <div className={Styles.plainQuestionContainer}>
          <div className={Styles.editorContainer}>
            <div>
              <p className={Styles.txt}>Question Number</p>
              <input
                type="number"
                value={questionNumber}
                onChange={(e) => setQuestionNumber(parseInt(e.target.value))}
              />
            </div>
            <div className="">
              <div className="">
                <p className={Styles.txt}>Paste your question here</p>
                <Editor
                  setValue={setQuestionTextValue}
                  editorId="editor1"
                  value={questionText}
                />
                <ErrorComponent value={questionText} />
              </div>
              <div className="">
                <p className={Styles.txt}>
                  Select Image if the Question has Image
                </p>
                <img
                  src={
                    resolveImageURL(exerciseQuestion?.questionImage || "") ||
                    tempQuestionImagePath ||
                    placeholderImage
                  }
                  id="photo"
                  style={{ width: "150px", height: "80px" }}
                />
                <input
                  type="file"
                  id="file"
                  onChange={handleQuestionImageChange}
                />
              </div>
              <div className="">
                <p className={Styles.txt}>
                  Paste your option{"  "}
                  <span style={{ color: "red", fontWeight: "bolder" }}>
                    {" "}
                    A{" "}
                  </span>
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
                <p className={Styles.txt}>
                  Paste your option{" "}
                  <span style={{ color: "red", fontWeight: "bolder" }}>B</span>{" "}
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
                <p className={Styles.txt}>
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
                <p className={Styles.txt}>
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
              </div>
              <div className="">
                <p className={Styles.txt}>Choose Answer here</p>
                <SelectDropdown
                  title=""
                  items={answerOptions}
                  handleSelect={setOption_answer_Text}
                />
              </div>

              <div className="">
                <p className={Styles.txt}>Paste your option Description here</p>
                <Editor
                  setValue={setDescription_Text}
                  editorId="editor7"
                  value={description}
                />
              </div>
              <div className="">
                <p className={Styles.txt}>
                  Select Image if the description has Image
                </p>
                <img
                  src={
                    resolveImageURL(exerciseQuestion?.descriptionImage || "") ||
                    tempDescriptionImagePath ||
                    placeholderImage
                  }
                  style={{ width: "150px", height: "80px" }}
                />
                <input
                  type="file"
                  id="file"
                  onChange={handleDescriptionImageChange}
                />
              </div>
            </div>
          </div>
          <div className={Styles.questionBtn}>
            <button
              className={Styles.submitBtn}
              onClick={updateExerciseQuestionToBackend}
            >
              Update
            </button>
            <button
              className={Styles.clearBtn}
              onClick={() => {
                navigate(-1);
              }}
            >
              Back To View Questions
            </button>
          </div>
        </div>
      </div>
    </LoadingOverlayWrapper>
  );
}
