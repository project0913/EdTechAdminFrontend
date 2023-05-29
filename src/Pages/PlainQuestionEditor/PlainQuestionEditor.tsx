import { CSSProperties, useContext, useEffect, useState } from "react";
import placeholderImage from "../../assets/place_holder.jpg";
import styles from "./plainQuestionEditor.module.css";
import "react-quill/dist/quill.snow.css";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";

import { PlainQuestion } from "../../models/question.model";
import { AxiosError } from "axios";
import { FadeLoader } from "react-spinners";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resolveImageURL, showSuccessToast } from "../../utils/helper";
import {
  updateGroupedQuestionToServer,
  updatePlainQuestionToServer,
} from "../../DataService/editQuestion.service";
import { Editor } from "../../quill/Editor";
import ErrorComponent from "../../components/ErrorComponent";
import { ViewPlainQuestionContext } from "../../context/viewPlainQuestionContext";

const override: CSSProperties = {
  margin: "10 auto",
  borderColor: "red",
};

export default function PlainQuestionEditor() {
  const viewPlainQuestionState = useContext(ViewPlainQuestionContext);
  const { setPlainQuestionState, ...pureState } = viewPlainQuestionState;
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
    console.log(pureState);

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

      for (const msg of messages) {
        msgTxt += msg + " ";
      } // concatenate array of error messages

      setErrorMessage(msgTxt);
      setShowErrorToast(true);
    } else {
      showSuccessToast("Updated successfully");
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
      <div className={styles.bodyPlainQuestion}>
        <div className={styles.plainQuestionContainer}>
          <div className={styles.editorContainer}>
            <div>
              <p className={styles.txt}>Question Number</p>
              <input
                type="number"
                value={questionNumber}
                onChange={(e) => setQuestionNumber(parseInt(e.target.value))}
              />
            </div>
            <div className="">
              <div className="">
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
                  src={
                    resolveImageURL(question?.questionImage || "") ||
                    tempQuestionImagePath ||
                    placeholderImage
                  }
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
                <p className={styles.txt}>
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
              </div>
              <div className="">
                <p className={styles.txt}>Choose Answer here</p>
                <SelectDropdown
                  title=""
                  items={answerOptions}
                  handleSelect={setOption_answer_Text}
                />
              </div>

              <div className="">
                <p className={styles.txt}>Edit Year</p>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div className="">
                <p className={styles.txt}>Paste your option Description here</p>
                <Editor
                  setValue={setDescription_Text}
                  editorId="editor7"
                  value={description}
                />
              </div>
              <div className="">
                <p className={styles.txt}>
                  Select Image if the description has Image
                </p>
                <img
                  src={
                    resolveImageURL(question?.descriptionImage || "") ||
                    tempDescriptionImagePath ||
                    placeholderImage
                  }
                  className={styles.img}
                />
                <input
                  type="file"
                  id="file"
                  onChange={handleDescriptionImageChange}
                />
              </div>
            </div>
          </div>
          <div className={styles.questionBtn}>
            <button
              className={styles.submitBtn}
              onClick={updatePlainQuestionToBackend}
            >
              Update
            </button>

            <button
              className={styles.clearBtn}
              onClick={() => {
                if (isGroupedQuestion) {
                  navigate("/admin-user/view-grouped-questions", {
                    state: {
                      direction: viewPlainQuestionState.selectedCourse,
                    },
                    replace: true,
                  });
                } else {
                  navigate("/admin-user/view-plain-questions", {
                    state: {
                      course: viewPlainQuestionState.selectedCourse,
                      year: viewPlainQuestionState.selectedYear,
                      page: viewPlainQuestionState.page,
                    },
                    replace: true,
                  });
                }
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
