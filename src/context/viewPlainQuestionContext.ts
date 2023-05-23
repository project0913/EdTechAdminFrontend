import { createContext } from "react";
import { ViewPlainQuestionState } from "../types/viewPlainQuestionState";

export const ViewPlainQuestionContext = createContext<ViewPlainQuestionState>({
  courses: [],
  years: [],
  page: 1,
  selectedCourse: "",
  selectedYear: "",
});
