import { Exercise } from "../models/exercise.model";
import axios from "../api/axios";
import { ExerciseQuestion } from "../models/exerciseQuestion.model";
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
export async function updateExerciseQuestionToServer(
  id: string,
  question: ExerciseQuestion | any
) {
  try {
    let raw = await axios.put(`/exercise-questions/${id}`, question);
    let data = raw.data;
    return data;
  } catch (error) {
    return error;
  }
}
export async function getAvailableExerciseFromServer(
  grade: number,
  courseId: string
) {
  try {
    let raw = await axios.post("/exercises/get-all", { grade, courseId });
    let data = raw.data as Exercise[];
    if (data.length == 0) return [];
    return data.map((exercise) => ({
      label: `Exercise ${exercise.exerciseNumber}`,
      value: exercise._id,
    })) as SelectOption[];
  } catch (error) {
    return error;
  }
}
export async function getAvailableExercise(grade: number, courseId: string) {
  let raw = await axios.post("/exercises/get-all", { grade, courseId });
  let data = raw.data as Exercise[];
  if (data.length == 0) return [];
  return data;
}
