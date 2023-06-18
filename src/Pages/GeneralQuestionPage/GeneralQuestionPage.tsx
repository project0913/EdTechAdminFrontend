import { CSSProperties, useState } from "react";
import { Editor } from "../../quill/Editor";
import { GeneralQuestion } from "../../models/general.model";
import { showErrorToast, showSuccessToast } from "../../utils/helper";
import { submitGeneralQuestionToServer } from "../../DataService/submit-questions.service";
import { AxiosError } from "axios";

import ErrorComponent from "../../components/ErrorComponent";
import styles from "./general.module.css";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { FadeLoader } from "react-spinners";

import placeholderImage from "../../assets/place_holder.jpg";

import "react-quill/dist/quill.snow.css";

const override: CSSProperties = {
  margin: "10 auto",
  borderColor: "red",
};

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
    console.log(val);

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

    console.log(JSON.stringify(general));

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
      <div className="directionPageStyle" style={{ backgroundColor: "black" }}>
        <div className={styles.generalBackground}>
          <div className={styles.generalHeader}></div>
          <div className="">
            <div>
              <p
                className={styles.txt}
                style={{
                  fontWeight: "bold",
                  color: "green",
                  paddingTop: "10 px",
                }}
              >
                Question Number
              </p>
              <input
                type="number"
                value={questionNumber}
                onChange={(e) => setQuestionNumber(parseInt(e.target.value))}
              />
            </div>
            <p
              className={styles.txt}
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
                onChange={handleQuestionImageChange}
                className={styles.plainTxt}
                style={{ display: "none" }}
              />
            </label>
            <span className={styles.txt}>
              {tempDescriptionImagePath ? "No file chosen" : ""}
            </span>
          </div>

          <div className="">
            <p
              className={styles.txt}
              style={{ fontWeight: "bold", color: "green" }}
            >
              Paste your option{" "}
              <span style={{ color: "blue", fontWeight: "bolder" }}>A</span>{" "}
              here
            </p>
            <Editor
              setValue={setOption_a_Text}
              value={option_a}
              editorId="editor2"
            />
            <ErrorComponent value={option_a} />
          </div>
          <div className="">
            <p
              className={styles.txt}
              style={{ fontWeight: "bold", color: "green" }}
            >
              Paste your option{" "}
              <span style={{ color: "blue", fontWeight: "bolder" }}>B</span>{" "}
              here
            </p>
            <Editor
              setValue={setOption_b_Text}
              value={option_b}
              editorId="editor3"
            />
            <ErrorComponent value={option_b} />
          </div>
          <div className="">
            <p
              className={styles.txt}
              style={{ fontWeight: "bold", color: "green" }}
            >
              Paste your option{" "}
              <span style={{ color: "blue", fontWeight: "bolder" }}>C</span>{" "}
              here
            </p>
            <Editor
              setValue={setOption_c_Text}
              value={option_c}
              editorId="editor4"
            />
            <ErrorComponent value={option_c} />
          </div>
          <div className="">
            <p
              className={styles.txt}
              style={{ fontWeight: "bold", color: "green" }}
            >
              Paste your option{" "}
              <span style={{ color: "blue", fontWeight: "bolder" }}>D</span>{" "}
              here
            </p>
            <Editor
              setValue={setOption_d_Text}
              value={option_d}
              editorId="editor5"
            />
            <ErrorComponent value={option_d} />
            <div className={styles.answerYear}>
              <div>
                <b
                  className={styles.txt}
                  style={{ fontWeight: "bold", color: "blue" }}
                >
                  Choose Answer here
                </b>
                <SelectDropdown
                  title=""
                  items={answerOptions}
                  handleSelect={setOption_answer_Text}
                />
              </div>
            </div>

            <div className={styles.plainTxt}>
              <p
                className={styles.txt}
                style={{ fontWeight: "bold", color: "green" }}
              >
                Paste your option Description here
              </p>
              <Editor
                setValue={setDescription_Text}
                editorId="editor6"
                value={description}
              />
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
                  onChange={handleQuestionImageChange}
                  className={styles.plainTxt}
                  style={{ display: "none" }}
                />
              </label>
              <span className={styles.txt}>
                {tempDescriptionImagePath ? "No file chosen" : ""}
              </span>
            </div>
          </div>
          <div className={styles.questionBtn} style={{ textAlign: "center" }}>
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
      </div>
    </LoadingOverlayWrapper>
  );
}
