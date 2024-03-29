import { CSSProperties, useEffect, useState } from "react";
import styles from "./directionpage.module.css";
import { fetchGroupedCourses } from "../../DataService/fetchCourse.service";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";

import { Direction } from "../../models/direction.model";
import { submitDirectionToServer } from "../../DataService/submit-questions.service";
import { yearsOptions } from "../../constants";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { FadeLoader } from "react-spinners";
import { AxiosError } from "axios";
import { showErrorToast, showSuccessToast } from "../../utils/helper";
import { Editor } from "../../quill/Editor";
import ErrorComponent from "../../components/ErrorComponent";

const override: CSSProperties = {
  margin: "10 auto",
  borderColor: "red",
};

export default function DirectionPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<SelectOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [directionText, setDirectionText] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [passage, setPassage] = useState<string | undefined>(undefined);
  const [directionNumber, setDirectionNumber] = useState(1);
  const [year, setYear] = useState(2015);

  useEffect(() => {
    fetchCoursesFromServer();
  }, []);
  const fetchCoursesFromServer = async () => {
    let coursesFromServer = await fetchGroupedCourses();
    setCourses(coursesFromServer);
    setSelectedCourse(coursesFromServer[0].value);
  };

  const submitQuestionToBackend = async () => {
    let direction: Direction = {
      course: selectedCourse,
      courseYear: parseInt(year.toString()),
      directionNumber,
      sectionName,
      directionText,
      passage,
    };
    setLoading((prev) => true);
    setErrorMessage("");
    const result = await submitDirectionToServer(direction);
    if (result instanceof AxiosError) {
      let msgTxt = "";
      const messages =
        result.response?.data?.message ||
        (["something is wrong try again Later"] as Array<string>);
      for (const msg of messages) msgTxt += msg + " "; //concatenate array of error messages
      setErrorMessage(msgTxt);
      showErrorToast();
    } else {
      setLoading(false);
      showSuccessToast("Direction Inserted successfully");
    }
  };

  const handleCourseChange = (e: any) => {
    setSelectedCourse(e.target.value);
  };

  const setDirection_text = (val: string) => {
    setDirectionText(val);
  };

  const setPassage_Text = (val: string) => {
    setPassage(val);
  };

  const handleYearsChange = (e: any) => {
    setYear(e.target.value);
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
      <div className={styles.directionQuestionBg}>
        <div className="direction-question">
          <div className={styles.directionHeader}>
            <div>
              <SelectDropdown
                title="Courses"
                items={courses}
                value={selectedCourse}
                handleSelect={handleCourseChange}
              />
            </div>

            <div>
              <b>Select Year</b>
              <SelectDropdown
                title=""
                items={yearsOptions}
                value={year}
                handleSelect={handleYearsChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="directionPageStyle" style={{ backgroundColor: "black" }}>
        <div className="directionBody">
          <div className={styles.txtEditor}>
            <div>
              <p className={styles.txt}>Fill Section Number Here</p>
              <input
                type="number"
                onChange={(e) => setDirectionNumber(parseInt(e.target.value))}
              />
            </div>
            <div>
              <p className={styles.txt}>Paste Section Name</p>
              <input
                onChange={(e) => setSectionName(e.target.value)}
                value={sectionName}
              />
            </div>

            <div>
              <p className={styles.txt}>Paste your Direction Text Here</p>

              <Editor
                setValue={setDirection_text}
                value={directionText}
                editorId="editor1"
              />
              <ErrorComponent value={directionText} />
            </div>

            <div>
              <p className={styles.txt}>Paste your passage here if any</p>
              <Editor
                setValue={setPassage_Text}
                value={passage || ""}
                editorId="editor2"
              />
            </div>
            <div
              className={styles.submitButton}
              style={{ textAlign: "center" }}
            >
              <button
                onClick={submitQuestionToBackend}
                className={styles.submitBtn}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlayWrapper>
  );
}
