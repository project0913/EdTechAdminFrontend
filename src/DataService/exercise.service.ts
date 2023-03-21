import { Exercise } from "../models/exercise.model";
import axios from "../api/axios";
import { ExerciseQuestion } from "src/models/exerciseQuestion.model";
import { SelectOption } from "./service.types";

export async function submitExerciseToServer(exercise: Exercise) {
  try {
    let raw = await axios.post(`/exercises/create`, exercise);
    let data = raw.data;
    return data;
  } catch (error) {
    return error;
  }
}
export async function submitExerciseQuestionToServer(
  question: ExerciseQuestion
) {
  try {
    let raw = await axios.post("/exercise-questions", question);
    let data = raw.data;
    return data;
  } catch (error) {
    return error;
  }
}
export async function getExerciseQuestionFromServer(
  grade: number,
  courseId: string
) {
  try {
    let raw = await axios.post("/exercises/get-all", { grade, courseId });
    let data = raw.data as Exercise[];
    return data.map((exercise) => ({
      label: `Exercise ${exercise.exerciseNumber}`,
      value: exercise.exerciseNumber.toString(),
    })) as SelectOption[];
  } catch (error) {
    return error;
  }
}

export async function fetchExerciseCourses() {
  let raw = await axios.get(`/`);
  let data = raw.data as { _id: string; name: string }[];
  return data.map((c) => ({ label: c.name, value: c._id })) as SelectOption[];
}
export async function fetchExerciseCoursesGrade(courseId: string) {
  let raw = await axios.get(`/`);
  let data = raw.data as { grade: number }[];
  return data.map((g) => ({
    label: g.grade.toString(),
    value: g.grade.toString(),
  })) as SelectOption[];
}
export async function fetchExerciseCoursesGradeChapter(courseId: string) {
  let raw = await axios.get(`/`);
  let data = raw.data as { chapter: string }[];
  return data.map((ch) => ({
    label: ch.chapter.toString(),
    value: ch.chapter.toString(),
  })) as SelectOption[];
}
