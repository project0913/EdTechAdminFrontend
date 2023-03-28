import React, { useEffect, useState } from "react";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import { fetchExamCategories } from "../../DataService/fetchExamCatagories.service";
import { fetchExamSubCategories } from "../../DataService/fetchSubExamCategory";
import ErrorComponent from "../../components/ErrorComponent";
import { Exercise } from "../../models/exercise.model";
import { AxiosError } from "axios";
import { showErrorToast, showSuccessToast } from "../../utils/helper";
import { submitExerciseToServer } from "../../DataService/exercise.service";
import { chapterOptions, gradeOptions } from "../../constants";
import styles from "./exercisePage.module.css";

export default function ExercisePage() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<SelectOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [exerciseNumber, setExerciseNumber] = useState(1);
  const [gradeSelected, setGradeSelected] = useState("9");
  const [chapterSelected, setChapterSelected] = useState("1");
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);

  async function fetchInitialFromServer() {
    let data = await fetchExamCategories();

    let coursesOption = [];
    for (const course of data[0].courses) {
      coursesOption.push({ label: course.name, value: course._id });
    }
    setCourses(coursesOption);
    setSelectedCourse(coursesOption[0].value);
  }

  useEffect(() => {
    fetchInitialFromServer();
  }, []);
  const handleGradeChange = (e: any) => {
    setGradeSelected(e.target.value);
  };

  const handleSelectedCourse = (e: any) => {
    setSelectedCourse(e.target.value);
  };
  const handleSelectChapterChange = (e: any) => {
    setChapterSelected(e.target.value);
  };

  const submitExercise = async () => {
    let exercise: Exercise = {
      chapter: parseInt(chapterSelected),
      grade: parseInt(gradeSelected),
      courseId: selectedCourse,
      exerciseNumber: exerciseNumber,
    };
    console.log(exercise);

    let result = await submitExerciseToServer(exercise);
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
    }
  };

  return (
    <div>
      <div className={""}>
        <div className={styles.headerBg}>
          <SelectDropdown
            title=""
            items={gradeOptions}
            handleSelect={handleGradeChange}
          />

          <SelectDropdown
            title=""
            items={courses}
            handleSelect={handleSelectedCourse}
          />

          <SelectDropdown
            title=""
            items={chapterOptions}
            handleSelect={handleSelectChapterChange}
          />
        </div>
      </div>

      <div>
        <p className={styles.txt}>Exercise Number</p>
        <input
          type="number"
          value={exerciseNumber}
          onChange={(e) => setExerciseNumber(parseFloat(e.target.value))}
          className={styles.editor}
        />
        <br />
        <ErrorComponent value={exerciseNumber.toString()} />
      </div>
      <div>
        <button
          onClick={() => {
            submitExercise();
          }}
          className={styles.submitBtn}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
