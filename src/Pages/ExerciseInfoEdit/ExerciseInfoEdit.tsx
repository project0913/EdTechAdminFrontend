import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import {
  isEmptyForRichText,
  override,
  showSuccessToast,
} from "../../utils/helper";
import ErrorComponent from "../../components/ErrorComponent";
import Editor from "../../quill/Editor";
import { useLocation, useNavigate } from "react-router-dom";
import { Exercise } from "../../models/exercise.model";
import { updateExerciseInfoToServer } from "../../DataService/editExerciseInfo.service";
import { gradeOptions } from "../../constants";
import { SelectOption } from "../../components/SelectDropdown";
import Styles from "./exerciseInfo.module.css";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { FadeLoader } from "react-spinners";

export default function ExerciseInfoEdit() {
  const [grade, setGrade] = useState("");
  const [chapter, setChapter] = useState("");
  const [gradeSelected, setGradeSelected] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [course, setCourse] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [chapterSelected, setChapterSelected] = useState("");
  const [exerciseNumber, setExerciseNumber] = useState(Number);
  const [loading, setLoading] = useState(false);
  const [exerciseInfo, setExerciseInfo] = useState<Exercise>();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    let editableExerciseInfo = location.state.exercise as Exercise;
    setExerciseInfo(editableExerciseInfo);
    fillForm(editableExerciseInfo);
  }, []);

  const submitExerciseQuestionInfoToBackend = async () => {
    let updateExerciseQuestionInfo: Exercise = {
      chapter: parseInt(chapterSelected),
      grade: parseInt(gradeSelected),
      courseId: selectedCourse,
      exerciseNumber: exerciseNumber,
    };

    console.log(
      "has empty field " +
        isEmptyForRichText(updateExerciseQuestionInfo, "exerciseInfo")
    );

    if (isEmptyForRichText(updateExerciseQuestionInfo, "exerciseInfo")) {
      return "";
    }
    const result = await updateExerciseInfoToServer(
      updateExerciseQuestionInfo,
      exerciseInfo?._id || ""
    );
  };

  const setGrade_Number = (val: string) => {
    setGrade(val);
  };
  const setChapter_Number = (val: string) => {
    setChapter(val);
  };

  const setExercise_Number = (val: number) => {
    setExerciseNumber(val);
  };

  const fillForm = (exercise: Exercise) => {
    setChapter(chapter);
    setExerciseNumber(exercise.exerciseNumber);
    setGrade(grade);
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
      <div className={Styles.exerciseInfoBody}>
        <div className="editor-discrption mt-3">
          <p className={Styles.txt}>Edit your Exercise number here</p>
          <Editor setValue={setChapter} value={chapter} editorId="editor1" />
          <ErrorComponent value={chapter} />
        </div>
        <div className="editor-discrption mt-3">
          <p className={Styles.txt}>Edit your Grade here</p>
          <Editor setValue={setGrade_Number} value={grade} editorId="editor2" />
          <ErrorComponent value={grade} />
        </div>
        <div>
          <p className={Styles.txt}>Exercise Number</p>
          <input
            type="number"
            value={exerciseNumber}
            onChange={(e) => setExerciseNumber(exerciseNumber)}
          />
        </div>
        <div>
          <button
            onClick={submitExerciseQuestionInfoToBackend}
            className={Styles.updateBtn}
          >
            Update
          </button>
          <button
            onClick={() => {
              navigate(-1);
            }}
            className={Styles.backToMain}
          >
            Back To View Questions
          </button>
        </div>
      </div>
    </LoadingOverlayWrapper>
  );
}
