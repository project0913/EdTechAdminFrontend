import axios from "../api/axios";
import { PlainQuestion } from "../models/question.model";

export async function updatePlainQuestionToServer(
  questionId: string,
  question: PlainQuestion,
  questionImage: string,
  descriptionImage: string
) {
  try {
    let formData = new FormData();
    formData.append("questionText", question.questionText);
    formData.append("answer", question.answer);
    formData.append("year", question.year.toString());
    formData.append("option_a", question.option_a);
    formData.append("option_b", question.option_b);
    formData.append("option_c", question.option_c);
    formData.append("option_d", question.option_d);
    formData.append(
      "questionNumber",
      question?.questionNumber?.toString() || "0"
    );
    formData.append("course", question?.course || "");
    formData.append("description", question.description);
    formData.append("questionImage", questionImage);
    console.log("image set to form data--------");

    formData.append("descriptionImage", descriptionImage);

    console.log(questionImage);
    console.log(formData.get("questionText"));

    let raw = await axios.post(`/questions/update/${questionId}`, formData);
    let data = raw.data as PlainQuestion;
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function updateGroupedQuestionToServer(
  questionId: string,
  question: PlainQuestion,
  questionImage: string,
  descriptionImage: string
) {
  try {
    let formData = new FormData();
    formData.append("questionText", question.questionText);
    formData.append("answer", question.answer);
    formData.append("year", question.year.toString());
    formData.append("option_a", question.option_a);
    formData.append("option_b", question.option_b);
    formData.append("option_c", question.option_c);
    formData.append("option_d", question.option_d);
    formData.append(
      "questionNumber",
      question?.questionNumber?.toString() || "0"
    );
    formData.append("direction", question?.direction || "");
    formData.append("description", question.description);
    formData.append("questionImage", questionImage);
    console.log("image set to form data--------");

    formData.append("descriptionImage", descriptionImage);

    console.log(questionImage);
    console.log(formData.get("questionText"));

    let raw = await axios.put(`/grouped-questions/${questionId}`, formData);
    let data = raw.data as PlainQuestion;
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function deletePlainQuestion(questionId: string) {
  try {
    let raw = await axios.delete(`/questions/${questionId}`);
    let data = raw.data;
    return data;
  } catch (error) {
    return error;
  }
}

export async function deleteGroupedQuestion(questionId: string) {
  try {
    let raw = await axios.delete(`/grouped-questions/${questionId}`);
    let data = raw.data;
    return data;
  } catch (error) {
    return error;
  }
}
