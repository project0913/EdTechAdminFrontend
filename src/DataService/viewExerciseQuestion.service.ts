import axios from "../api/axios";
import { ExerciseQuestion } from "../models/exercise.model";
type GetQuestionDto = {
  questions: ExerciseQuestion[];
  count: number;
};

export async function fetchExerciseQuestions({}) {
  let raw = await axios.post(`/exercise-questions/for-admin`, {});
  let data = raw.data;
  return data as GetQuestionDto;
}
