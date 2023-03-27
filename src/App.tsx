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
import { ViewExercisePage } from "./Pages/viewExercisePage/ViewExercisePage";
import ExerciseInfoEdit from "./Pages/ExerciseInfoEdit/ExerciseInfoEdit";

function App() {
  const router = createBrowserRouter([
    { path: "", element: <AdminPublicLogin /> },
    {
      path: "edit-general-questions",
      element: <GeneralQuestionPageEditor />,
    },
    { path: "admin-dashboard", element: <AdminDashboard /> },

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
          path: "plain-question",
          element: <PlainQuestionData />,
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
          path: "grouped-question",
          element: <GroupedQuestionPage />,
        },
        {
          path: "view-grouped-questions",
          element: <GroupedQuestionPage />,
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
          element: <PlainQuestionData />,
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
          path: "view-directions",
          element: <ViewDirectionsPage />,
        },
        {
          path: "grouped-question",
          element: <GroupedQuestionPage />,
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
          element: <ViewExercisePage />,
        },
        {
          path: "view-exercise-question",
          element: <ViewExerciseQuestionPage />,
        },
        {
          path: "exercise-info-edit",
          element: <ExerciseInfoEdit />,
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
