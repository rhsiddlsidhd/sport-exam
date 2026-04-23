import { StrictMode, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Header from "./components/layout/Header.tsx";
import SubjectLayout from "./components/layout/SubjectLayout.tsx";
import NotFound from "./pages/NotFound.tsx";
import { examLoader } from "./loaders/examLoader.ts";
import { reviewLoader } from "./loaders/reviewLoader.ts";

const SubjectPage = lazy(() => import("./pages/SubjectPage.tsx"));
const QuestionPage = lazy(() => import("./pages/QuestionPage.tsx"));
const ReviewPage = lazy(() => import("./pages/ReviewPage.tsx"));

const router = createBrowserRouter([
  {
    element: <Header />,
    children: [
      { index: true, element: <App /> },
      {
        element: <SubjectLayout />,
        children: [
          { path: ":subject", element: <SubjectPage /> },
          { path: ":subject/:year", element: <QuestionPage />, loader: examLoader },
          { path: ":subject/:year/review", element: <ReviewPage />, loader: reviewLoader },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
