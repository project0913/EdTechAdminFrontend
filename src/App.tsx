import "./App.css";
import PlainQuestionData from "./Pages/PlainQuestionPage/PlainQuestionData";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import GroupedQuestionPage from "./Pages/GroupedQuestionPage/GroupedQuestionPage";
import DirectionPage from "./Pages/DirectionPage/DirectionPage";
import LayoutComponent from "./components/LayoutComponent";
import ViewPlainQuestionsPage from "./Pages/viewQuestionsPage/ViewPlainQuestionsPage";
import PlainQuestionEditor from "./Pages/PlainQuestionEditor/PlainQuestionEditor";
import { ViewGroupedQuestionsPage } from "./Pages/viewGroupedQuestionPage/ViewGroupedQuestionPage";
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

import { useState } from "react";
import ExerciseQuestionPage from "./Pages/ExerciseQuestionPage/ExerciseQuestionPage";
import GeneralQuestion from "./Pages/GeneralQuestionPage/GeneralQuestionPage";
import ViewExerciseQuestionPage from "./Pages/viewExerciseQuestionPage/ViewExerciseQuestionPage";
import GeneralQuestionPage from "./Pages/GeneralQuestionPage/GeneralQuestionPage";
import ViewGeneralQuestionPage from "./Pages/viewGeneralQuestionPage/ViewGeneralQuestionPage";

function App() {
  const [v, setV] = useState("");
  const router = createBrowserRouter([
    { path: "", element: <AdminPublicLogin /> },

    { path: "admin-dashboard", element: <AdminDashboard /> },
    {
      path: "clerk-auth",
      element: <ClerkRouteGuard children={<ClerkAuthPage />} />,
    },
    { path: "admin-login", element: <AdminLogin /> },
    {
      path: "view-exercise-question",
      element: <ViewExerciseQuestionPage />,
    },

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
          path: "grouped-question",
          element: <GroupedQuestionPage />,
        },

        {
          path: "direction",
          element: <DirectionPage />,
        },
        {
          path: "general",
          element: <GeneralQuestionPage />,
        },
        {
          path: "exercise",
          element: <ExerciseQuestionPage />,
        },

        {
          path: "view-plain-questions",
          element: <ViewPlainQuestionsPage />,
        },
        {
          path: "view-grouped-questions",
          element: <ViewGroupedQuestionsPage />,
        },

        {
          path: "edit-plain-question",
          element: <PlainQuestionEditor />,
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
          path: "view-exercise-question",
          element: <ViewExerciseQuestionPage />,
        },
        {
          path: "view-general-question",
          element: <ViewGeneralQuestionPage />,
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
          path: "grouped-question",
          element: <GroupedQuestionPage />,
        },

        {
          path: "direction",
          element: <DirectionPage />,
        },
        {
          path: "general",
          element: <GeneralQuestion />,
        },
        {
          path: "exercise",
          element: <ExerciseQuestionPage />,
        },

        {
          path: "view-plain-questions",
          element: <ViewPlainQuestionsPage />,
        },
        {
          path: "view-grouped-questions",
          element: <ViewGroupedQuestionsPage />,
        },

        {
          path: "edit-plain-question",
          element: <PlainQuestionEditor />,
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
          path: "view-exercise-question",
          element: <ViewExerciseQuestionPage />,
        },
        {
          path: "view-general-question",
          element: <ViewGeneralQuestionPage />,
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
