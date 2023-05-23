import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ViewPlainQuestionContext } from "./context/viewPlainQuestionContext";
//import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ViewPlainQuestionContext.Provider
    value={{
      courses: [],
      years: [],
      page: 1,
      selectedCourse: "",
      selectedYear: "",
    }}
  >
    <App />
  </ViewPlainQuestionContext.Provider>
);
