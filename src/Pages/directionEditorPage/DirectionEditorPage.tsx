import React, { useEffect, useState } from "react";
import Editor from "../../quill/Editor";
import { Direction } from "../../models/direction.model";
import { useLocation } from "react-router-dom";
import { updateDirections } from "../../DataService/editDirections.service";
import { AxiosError } from "axios";

export default function DirectionEditorPage() {
  const [direction, setDirection] = useState<Direction>();
  const [directionText, setDirectionText] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [passage, setPassage] = useState<string | undefined>(undefined);
  const [directionNumber, setDirectionNumber] = useState(1);
  const [year, setYear] = useState<string>("");
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
    const result = await updateDirections(
      direction?._id || "",
      updatedDirection
    );

    if (result instanceof AxiosError) {
      //handle error
    } else {
      //handle success
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
  };

  const setPassage_Text = (val: string) => {
    setPassage(val);
  };

  return (
    <div className="direction-question-bg">
      <div className="direction-question">
        <div className="editor-container mt-3">
          <p>fill Direction Number here</p>
          <input
            type="number"
            onChange={(e) => setDirectionNumber(parseInt(e.target.value))}
            value={directionNumber}
          />
        </div>
        <div className="editor-container mt-3">
          <p>Edit Year</p>
          <input
            type="number"
            onChange={(e) => setYear(e.target.value)}
            value={year}
          />
        </div>

        <div className="editor-discrption mt-3">
          <p>Edit your Direction Text here</p>
          <Editor
            setValue={setDirection_text}
            editorId="editor1"
            value={directionText}
          />
        </div>

        <div className="section-name">
          <p>Edit Direction section Name here</p>
          <input
            onChange={(e) => setSectionName(e.target.value)}
            value={sectionName}
          />
        </div>

        <div className="passage-text mt-3 mb-3">
          <p>Edit your passage here if any</p>
          <Editor
            setValue={setPassage_Text}
            editorId="editor2"
            value={passage || ""}
          />
        </div>
      </div>
      <div className="submit-butt mb-3">
        <button className="btn btn-primary" onClick={submitQuestionToBackend}>
          update
        </button>
      </div>
    </div>
  );
}
