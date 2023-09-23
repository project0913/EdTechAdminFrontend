import axios from "../api/axios";
import { ExamCategory } from "../models/exam-catagory.model";

export async function fetchExamCategories() {
  let raw = await axios.get(`/exam-categories-with-courses`);
  let data = raw.data;
  return data as ExamCategory[];
}
// exam-categories

export async function createExamCategories(examCategory: any) {
  let raw = await axios.post(`/exam-categories`, examCategory);
  let data = raw.data;
  return data as ExamCategory[];
}
