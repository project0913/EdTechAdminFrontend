import React, { CSSProperties, useEffect, useState } from "react";
import styles from "./directionEditor.module.css";
import Editor from "../../quill/Editor";
import { Direction } from "../../models/direction.model";
import { useLocation } from "react-router-dom";
import { updateDirections } from "../../DataService/editDirections.service";
import { AxiosError } from "axios";
import { MathEditor } from "../../quill/EditorMath";
import {
  hasEmpty,
  isEmptyForRichText,
  showSuccessToast,
} from "../../utils/helper";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { FadeLoader } from "react-spinners";
import ErrorComponent from "../../components/ErrorComponent";

const override: CSSProperties = {
  margin: "10 auto",
  borderColor: "red",
};
export default function DirectionEditorPage() {
  const [direction, setDirection] = useState<Direction>();
  const [directionText, setDirectionText] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [passage, setPassage] = useState<string | undefined>(undefined);
  const [directionNumber, setDirectionNumber] = useState(1);
  const [year, setYear] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let editableDirection = location.state.direction as Direction;
    setDirection(editableDirection);
    fillForm(editableDirection);
  }, []);

  const submitQuestionToBackend = async () => {
    let updatedDirection: Direction = {
      course: direction?.course || "",
      courseYear: parseInt(year),
      directionNumber,
      sectionName,
      directionText,
      passage,
    };
    console.log(
      "has empty field " + isEmptyForRichText(updatedDirection, "directionText")
    );

    if (isEmptyForRichText(updatedDirection, "directionText")) {
      return "";
    }
    setLoading(true);
    const result = await updateDirections(
      direction?._id || "",
      updatedDirection
    );

    if (result instanceof AxiosError) {
      //handle error
      setLoading(false);
    } else {
      //handle success
      showSuccessToast("update success");
      setLoading(false);
    }
  };

  const fillForm = (direction: Direction) => {
    setDirectionNumber(direction.directionNumber);
    setDirectionText(direction.directionText);
    setSectionName(direction.sectionName);
    setPassage(direction.passage || "");
    setYear(direction.courseYear.toString());
  };

  const setDirection_text = (val: string) => {
    setDirectionText(val);
    console.log(val);
  };

  const setPassage_Text = (val: string) => {
    setPassage(val);
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
      <div className={styles.editorPage}>
        <div className="direction-question">
          <div className="editor-container mt-3">
            <p>Edit Year</p>
            <input
              type="number"
              onChange={(e) => setYear(e.target.value)}
              value={year}
            />
          </div>
          <div className="section-name">
            <p>Edit Direction section Number here</p>
            <input
              onChange={(e) => setSectionName(e.target.value)}
              value={sectionName}
            />
          </div>
          <div className="editor-container mt-3">
            <p>Fill Direction Number here</p>
            <input
              type="number"
              onChange={(e) => setDirectionNumber(parseInt(e.target.value))}
              value={directionNumber}
            />
          </div>

          <div className="editor-discrption mt-3">
            <p>Edit your Direction Text here</p>
            <MathEditor setValue={setDirection_text} value={directionText} />
            <ErrorComponent value={directionText} />
          </div>

          <div className="passage-text mt-3 mb-3">
            <p>Edit your passage here if any</p>
            <MathEditor setValue={setPassage_Text} value={passage || ""} />
          </div>
        </div>
        <div className="submit-butt mb-3">
          <button
            className={styles.updateBtn}
            onClick={submitQuestionToBackend}
          >
            Update
          </button>
        </div>
      </div>
    </LoadingOverlayWrapper>
  );
}
