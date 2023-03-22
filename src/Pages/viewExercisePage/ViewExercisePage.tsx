import React, { useEffect, useState } from "react";
import SelectDropdown, { SelectOption } from "../../components/SelectDropdown";
import { fetchExamCategories } from "../../DataService/fetchExamCatagories.service";
import { gradeOptions } from "../../constants";
import styles from "./viewExercisePage.module.css";
import { getAvailableExercise } from "../../DataService/exercise.service";
import { Exercise } from "../../models/exercise.model";
import { Link } from "react-router-dom";
export function ViewExercisePage() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<SelectOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [gradeSelected, setGradeSelected] = useState("9");
  const [chapterSelected, setChapterSelected] = useState("1");
  const [message, setMessage] = useState("Loading...");
  const [show, setShow] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  async function fetchInitialFromServer() {
    let data = await fetchExamCategories();

    let coursesOption = [];
    for (const course of data[0].courses) {
      coursesOption.push({ label: course.name, value: course._id });
    }
    setCourses(coursesOption);
    setSelectedCourse(coursesOption[0].value);
    setGradeSelected(gradeOptions[0].value);
    const exercisesFromServer = await getAvailableExercise(
      parseInt(gradeOptions[0].value),
      coursesOption[0].value
    );
    if (exercisesFromServer.length == 0) {
      setMessage("No Data Available");
    }
    setExercises(exercisesFromServer);
  }

  useEffect(() => {
    fetchInitialFromServer();
  }, []);

  useEffect(() => {
    fetchExercises(parseInt(gradeSelected), selectedCourse);
  }, [selectedCourse, gradeSelected]);

  const fetchExercises = async (grade: number, courseId: string) => {
    const exercisesFromServer = await getAvailableExercise(grade, courseId);
    if (exercisesFromServer.length == 0) {
      setMessage("No Data Available");
    }
    setExercises(exercisesFromServer);
  };

  const handleGradeChange = (e: any) => {
    setGradeSelected(e.target.value);
  };

  const handleSelectedCourse = (e: any) => {
    setSelectedCourse(e.target.value);
  };

  return (
    <div>
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
      </div>
      <div className={styles.allTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={`${styles.tableHeader} ${styles.th}`}>No</th>
              <th className={`${styles.tableHeader} ${styles.th}`}>Grade</th>
              <th className={`${styles.tableHeader} ${styles.th}`}>Chapter</th>
              <th className={`${styles.tableHeader} ${styles.th}`}>
                Exercise No
              </th>
              <th className={`${styles.tableHeader} ${styles.th}`}>
                View Questions
              </th>
              <th className={`${styles.tableHeader} ${styles.th}`}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {exercises.length > 0 ? (
              exercises.map((exercise, index) => (
                <tr key={index}>
                  <td className={`${styles.td} ${styles.tdNo}`}>{index + 1}</td>
                  <td className={styles.td}>{exercise.grade}</td>
                  <td className={styles.td}>{exercise.chapter}</td>
                  <td className={styles.td}>{exercise.exerciseNumber}</td>
                  <td className={styles.td}>
                    <Link
                      to={"/view-exercise-question"}
                      state={{ exerciseId: exercise._id }}
                    >
                      <button>View Questions</button>
                    </Link>
                  </td>
                  <td className={styles.td}>
                    <Link
                      to={"/edit-exercise-question"}
                      state={{ exerciseId: exercise._id }}
                    >
                      <button>Edit</button>
                    </Link>
                    <button>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>{message}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
