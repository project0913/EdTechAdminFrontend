import axios from "../api/axios";
import { GeneralQuestion } from "../models/general.model";
type GetQuestionDto = {
  questions: GeneralQuestion[];
  count: number;
};

export async function fetchGeneralQuestions(page: number) {
  let raw = await axios.get(`/general-questions?page=${page}`);
  let data = raw.data;
  return data as GetQuestionDto;
}
