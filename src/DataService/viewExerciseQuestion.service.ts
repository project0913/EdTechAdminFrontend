import { ExerciseQuestion } from "../models/exerciseQuestion.model";
import axios from "../api/axios";
export async function fetchExerciseQuestions(exerciseId: string | any) {
  let raw = await axios.get(`/exercise-questions/${exerciseId}`);
  let data = raw.data;
  return data as ExerciseQuestion[];
}
