import { useRef, useState } from "react";
import { GeneralQuestion } from "../../models/general.model";
import placeholderImage from "../../assets/place_holder.jpg";

import parse, {
  HTMLReactParserOptions,
  Element,
  domToReact,
} from "html-react-parser";
import { Link } from "react-router-dom";
import {
  resolveImageURL,
  showErrorToast,
  showSuccessToast,
} from "../../utils/helper";
import {
  fetchDirectionOfCourseByYear,
  fetchGroupedCourses,
  fetchGroupedCoursesDirectionYears,
} from "../../DataService/fetchCourse.service";
import { fetchGroupedQuestions } from "../../DataService/viewGroupedQuestion.service";
import { deletePlainQuestion } from "../../DataService/editQuestion.service";
import { AxiosError } from "axios";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      return <span>{domToReact(domNode.children)}</span>;
    }
  },
};

export default function viewGeneralQuestionPage() {
  const [questions, setQuestions] = useState<GeneralQuestion[]>([]);
  const isInitialMount = useRef(true);
  async function fetchGeneralQuestionFromServer(courseId: string) {}

  return <div>viewGeneralQuestionPage</div>;
}
