import axios from "../api/axios";
import { GeneralQuestion } from "../models/general.model";
type GetQuestionDto = {
  generals: GeneralQuestion[];
  count: number;
};

export async function fetchGeneralQuestions({}) {
  let raw = await axios.post(`/questions/for-admin`, {});
  let data = raw.data;
  return data as GetQuestionDto;
}
