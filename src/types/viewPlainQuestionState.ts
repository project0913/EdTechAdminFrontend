import { SelectOption } from "../components/SelectDropdown";

export type ViewPlainQuestionState = {
  courses: SelectOption[];
  years: SelectOption[];
  selectedCourse: string | undefined;
  selectedYear: string | undefined;
  page: number | undefined;
};
