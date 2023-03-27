import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { isEmptyForRichText, showSuccessToast } from "../../utils/helper";
import ErrorComponent from "../../components/ErrorComponent";
import Editor from "../../quill/Editor";
import { useLocation, useNavigate } from "react-router-dom";
import { Exercise } from "../../models/exercise.model";
import { updateExerciseInfoToServer } from "../../DataService/editExerciseInfo.service";
import { gradeOptions } from "../../constants";
import { SelectOption } from "../../components/SelectDropdown";

export default function ExerciseInfoEdit() {
  const [grade, setGrade] = useState("");
  const [chapter, setChapter] = useState("");
  const [exerciseNumber, setExerciseNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [exerciseInfo, setExerciseInfo] = useState<Exercise>();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    let editableExerciseInfo = location.state.exercise as Exercise;
    setExerciseInfo(editableExerciseInfo);
    fillForm(editableExerciseInfo);
  }, []);

  const submitExerciseQuestionInfoToBackend = async () => {
    let updateExerciseQuestionInfo: Exercise = {
      chapter,
      grade,
      exerciseNumber,
      courseId: "",
    };

    console.log(
      "has empty field " +
        isEmptyForRichText(updateExerciseQuestionInfo, "exerciseInfo")
    );

    if (isEmptyForRichText(updateExerciseQuestionInfo, "exerciseInfo")) {
      return "";
    }

    setLoading(true);
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

  const setExercise_Number = (val: string) => {
    setExerciseNumber(val);
  };

  const fillForm = (exercise: Exercise) => {
    setChapter(exercise.chapter);
    setExerciseNumber(exercise.exerciseNumber);
    setGrade(exercise.grade);
  };
  return (
    <div>
      <div className="editor-discrption mt-3">
        <p>Edit your Exercise number here</p>
        <Editor setValue={setChapter} value={chapter} editorId="editor1" />
        <ErrorComponent value={chapter} />
      </div>
      <div className="editor-discrption mt-3">
        <p>Edit your Grade here</p>
        <Editor setValue={setGrade_Number} value={grade} editorId="editor2" />
        <ErrorComponent value={grade} />
      </div>
      <div>
        <p className="">Exercise Number</p>
        <input
          type="number"
          value={exerciseNumber}
          onChange={(e) => setExerciseNumber(e.target.value)}
        />
      </div>
      <div>
        <button onClick={submitExerciseQuestionInfoToBackend}>Update</button>
        <button
          style={{ marginLeft: "200px" }}
          onClick={() => {
            navigate(-1);
          }}
        >
          Back To View Questions
        </button>
      </div>
    </div>
  );
}
