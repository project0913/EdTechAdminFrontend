import "./App.css";
import PlainQuestionData from "./Pages/PlainQuestionPage/PlainQuestionData";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import GroupedQuestionPage from "./Pages/GroupedQuestionPage/GroupedQuestionPage";
import DirectionPage from "./Pages/DirectionPage/DirectionPage";

import PlainQuestionEditor from "./Pages/PlainQuestionEditor/PlainQuestionEditor";

import DirectionEditorPage from "./Pages/directionEditorPage/DirectionEditorPage";
import ViewDirectionsPage from "./Pages/viewDirectionsPage/ViewDirectionsPage";
import AdminUserPage from "./Pages/AdminUserPage/AdminUserPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPublicLogin from "./Pages/publicLogin/AdminPublicLogin";
import ClerkAuthPage from "./Pages/ClerkAuthPage/ClerkAuthPage";
import { ClerkRouteGuard } from "./components/ClerkGuard";
import { AdminUserRouteGuard } from "./components/AdminUserPageGuard";
import { AdminDashboard } from "./Pages/AdminDashboard/AdminDashboard";
import AdminLogin from "./Pages/AdminLogin/AdminLogin";
import AdminUserDataView from "./Pages/Admin/AdminUserDataView";
import ViewClerkDetailPage from "./Pages/viewClerkDetailPage/ViewClerkDetailPage";
import AdminNotification from "./components/AdminNotification";
import { SystemAdminRouteGuard } from "./components/SystemAdminGuard";

import GeneralQuestion from "./Pages/GeneralQuestionPage/GeneralQuestionPage";

import GeneralQuestionPage from "./Pages/GeneralQuestionPage/GeneralQuestionPage";
import ViewPlainQuestionsPage from "./Pages/ViewQuestionsPage/ViewPlainQuestionsPage";
import ViewGeneralQuestionPage from "./Pages/ViewGeneralQuestionPage/viewGeneralQuestionPage";
import { ViewGroupedQuestionsPage } from "./Pages/viewGroupedQuestionPage/ViewGroupedQuestionPage";
import ExercisePage from "./Pages/Exercise/ExercisePage";
import ExerciseQuestionPage from "./Pages/ExerciseQuestionPage/ExerciseQuestionPage";

import GeneralQuestionPageEditor from "./Pages/GeneralQuestionEditor/GeneralQuestionPageEditor";
import ViewExerciseQuestionPage from "./Pages/viewExerciseQuestionPage/ViewExerciseQuestionPage";
import ExerciseQuestionEditorPage from "./Pages/ExerciseEditorPage/ExerciseEditorPage";
import ExerciseInfoEdit from "./Pages/ExerciseInfoEdit/ExerciseInfoEdit";
import { ViewPlainQuestionContext } from "./context/viewPlainQuestionContext";
import { useState } from "react";
import { ViewPlainQuestionState } from "./types/viewPlainQuestionState";
import { SelectCourse } from "./Pages/select-course/SelectCourse";
import DataHubApp from "./Pages/DataEnterCountry/DataCountry";
import { ExamCategoryPage } from "./Pages/ExamCategories/ExamCategoryPage";
import { MaterialResourcePage } from "./Pages/MaterialResourcePage/MaterialResourcePage";
import ViewMaterialResourcePage from "./Pages/ViewMaterialResourcePage/ViewMaterialResourcePage";
import ViewExamCategory from "./Pages/ViewExamCategory/ViewExamCategory";
import { AdminChallenge } from "./Pages/AdminChallenge/AdminChallenge";

function App() {
  const router = createBrowserRouter([
    { path: "", element: <AdminPublicLogin /> },
    { path: "select-course", element: <SelectCourse /> },
    { path: "admin-dashboard", element: <AdminDashboard /> },
    { path: "data", element: <DataHubApp /> },
    {
      path: "clerk-auth",
      element: <ClerkRouteGuard children={<ClerkAuthPage />} />,
    },
    { path: "admin-login", element: <AdminLogin /> },

    {
      path: "admin",
      element: (
        <SystemAdminRouteGuard
          children={<AdminUserDataView />}
        ></SystemAdminRouteGuard>
      ),
      children: [
        {
          path: "",
          element: <AdminDashboard />,
        },
        {
          path: "select-course",
          element: <SelectCourse />,
        },
        {
          path: "edit-plain-question",
          element: <PlainQuestionEditor />,
        },
        {
          path: "view-plain-questions",
          element: <ViewPlainQuestionsPage />,
        },
        {
          path: "grouped-question", //
          element: <GroupedQuestionPage />,
        },
        {
          path: "view-grouped-questions",
          element: <GroupedQuestionPage />,
        },
        {
          path: "view-material-resources",
          element: <ViewMaterialResourcePage />,
        },
        {
          path: "edit-material-resources",
          element: <MaterialResourcePage />,
        },
        {
          path: "edit-direction",
          element: <DirectionEditorPage />,
        },
        {
          path: "direction",
          element: <DirectionPage />,
        },
        {
          path: "view-directions",
          element: <ViewDirectionsPage />,
        },
        {
          path: "general-question",
          element: <GeneralQuestionPage />,
        },
        {
          path: "exam-category",
          element: <ExamCategoryPage />, //
        },
        {
          path: "material-resource",
          element: <MaterialResourcePage />, // MaterialResourcePage
        },
        {
          path: "view-general-question",
          element: <ViewGeneralQuestionPage />,
        },
        {
          path: "edit-general-questions",
          element: <GeneralQuestionPageEditor />,
        },
        {
          path: "exercise-question",
          element: <ExerciseQuestionPage />,
        },
        { path: "exercise", element: <ExercisePage /> },

        {
          path: "edit-exercise-question",
          element: <ExerciseQuestionEditorPage />,
        },
        {
          path: "view-exercise-question",
          element: <ViewExerciseQuestionPage />,
        },
      ],
    },

    { path: "view-clerk-detail", element: <ViewClerkDetailPage /> },
    { path: "admin-notification", element: <AdminNotification /> },
    {
      path: "admin-user",
      element: <AdminUserRouteGuard children={<AdminUserPage />} />,
      children: [
        {
          path: "",
          element: <SelectCourse />,
        },
        {
          path: "view-plain-questions",
          element: <ViewPlainQuestionsPage />,
        },
        {
          path: "edit-plain-question",
          element: <PlainQuestionEditor />,
        },

        {
          path: "direction",
          element: <DirectionPage />,
        },
        {
          path: "edit-direction",
          element: <DirectionEditorPage />,
        },
        {
          path: "exam-category",
          element: <ExamCategoryPage />,
        },

        {
          path: "edit-exam-category",
          element: <ExamCategoryPage />,
        },
        {
          path: "view-exam-category",
          element: <ViewExamCategory />,
        },
        {
          path: "material-resource",
          element: <MaterialResourcePage />, //
        },
        {
          path: "view-material-resources",
          element: <ViewMaterialResourcePage />,
        },
        {
          path: "edit-material-resources",
          element: <MaterialResourcePage />,
        },
        {
          path: "view-directions",
          element: <ViewDirectionsPage />,
        }, //
        {
          path: "grouped-question",
          element: <GroupedQuestionPage />,
        },
        {
          path: "plain-question",
          element: <PlainQuestionData />,
        },
        {
          path: "view-grouped-questions",
          element: <ViewGroupedQuestionsPage />,
        },
        {
          path: "general-question",
          element: <GeneralQuestion />,
        },
        {
          path: "view-general-question",
          element: <ViewGeneralQuestionPage />,
        },
        {
          path: "edit-general-questions",
          element: <GeneralQuestionPageEditor />,
        },
        { path: "exercise", element: <ExercisePage /> },
        { path: "exercise-question", element: <ExerciseQuestionPage /> },
        {
          path: "edit-exercise-question",
          element: <ExerciseQuestionEditorPage />,
        },

        {
          path: "view-exercise",
          element: <ViewExerciseQuestionPage />,
        },
        {
          path: "view-exercise-question",
          element: <ViewExerciseQuestionPage />,
        },
        {
          path: "exercise-info-edit",
          element: <ExerciseInfoEdit />,
        },

        {
          path: "create-admin-challenge",
          element: <AdminChallenge />,
        },
      ],
    },
  ]);
  const [viewPlainQuestionDataState, setViewPlainQuestionDataState] =
    useState<ViewPlainQuestionState>({
      courses: [],
      years: [],
      page: 0,
      selectedCourse: "",
      selectedYear: "",
    });
  const setViewPlainQuestionState = (
    viewPlainQuestionState: ViewPlainQuestionState
  ) => {
    setViewPlainQuestionDataState((prevState) => ({
      ...prevState,
      ...viewPlainQuestionState,
    }));
  };
  return (
    <div className="App">
      <ViewPlainQuestionContext.Provider
        value={{
          ...viewPlainQuestionDataState,
          setPlainQuestionState: setViewPlainQuestionState,
        }}
      >
        <ToastContainer />
        <RouterProvider router={router} />
      </ViewPlainQuestionContext.Provider>
    </div>
  );
}

export default App;
