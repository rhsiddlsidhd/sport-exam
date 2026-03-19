import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Header from "./components/layout/Header.tsx";
import SubjectLayout from "./components/layout/SubjectLayout.tsx";
import NotFound from "./pages/NotFound.tsx";

const SubjectPage = lazy(() => import("./pages/SubjectPage.tsx"));
const QuestionPage = lazy(() => import("./pages/QuestionPage.tsx"));
const ReviewPage = lazy(() => import("./pages/ReviewPage.tsx"));
const NotesPage = lazy(() => import("./pages/NotesPage.tsx"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route element={<Header />}>
            <Route index element={<App />} />
            <Route element={<SubjectLayout />}>
              <Route path=":subject" element={<SubjectPage />} />
              <Route path=":subject/:year" element={<QuestionPage />} />
            </Route>
            <Route path=":subject/:year/review" element={<ReviewPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
