import { useState } from "react";
import { Editor } from "../../quill/Editor";
import { GeneralQuestion } from "../../models/general.model";
import {
  resolveImageURL,
  showErrorToast,
  showSuccessToast,
} from "../../utils/helper";
import { submitGeneralQuestionToServer } from "../../DataService/submit-questions.service";
import { AxiosError } from "axios";
//import styles from "react-loading-overlay-ts/dist/styles";
import ErrorComponent from "../../components/ErrorComponent";
import styles from "./general.module.css";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";

export default function GeneralQuestionPage() {
  const [errorMessage, setErrorMessage] = useState("");
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
  const [questionNumber, setQuestionNumber] = useState<string | any>();
  const [show, setShow] = useState(false);
  const answerOptions: SelectOption[] = [
    { label: "A", value: "option_a" },
    { label: "B", value: "option_b" },
    { label: "C", value: "option_c" },
    { label: "D", value: "option_d" },
  ];
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
  const submitQuestionToBackend = async () => {
    let general: GeneralQuestion = {
      questionText: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      answer: "",
      questionImage: "",
      descriptionImage: "",
      description: "",
      questionNumber: undefined,
    };
  };

  const submitGeneralQuestionPageToBackend = async (e: any) => {
    e.preventDefault();
    setLoading((prev) => true);
    setErrorMessage("");
    showErrorToast();
    let general: GeneralQuestion = {
      questionText,
      option_a: option_a,
      option_b: option_b,
      option_c: option_c,
      option_d: option_d,
      answer: answerText,
      description: description,
      questionImage,
      descriptionImage,
      questionNumber: parseInt(questionNumber),
    };
    console.log("question image 00");
    console.log(questionImage);

    let result = await submitGeneralQuestionToServer(
      general,
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
    <div className={styles.generalBackground}>
      <div className={styles.generalHeader}></div>
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
            Select Image if the description has Image
          </p>
          <img src={tempDescriptionImagePath || ""} className={styles.img} />
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
          onClick={submitGeneralQuestionPageToBackend}
        >
          Submit
        </button>
        <button className={styles.clearBtn} onClick={clearForm}>
          Clear
        </button>
      </div>
    </div>
  );
}
