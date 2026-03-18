import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Header from "./components/layout/Header.tsx";
import SubjectLayout from "./components/layout/SubjectLayout.tsx";
import SubjectPage from "./pages/SubjectPage.tsx";
import QuestionPage from "./pages/QuestionPage.tsx";
import ReviewPage from "./pages/ReviewPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import NotesPage from "./pages/NotesPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route index element={<App />} />
          <Route element={<SubjectLayout />}>
            <Route path=":subject" element={<SubjectPage />} />
            <Route path=":subject/:year" element={<QuestionPage />} />
          </Route>
          <Route path="review" element={<ReviewPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
