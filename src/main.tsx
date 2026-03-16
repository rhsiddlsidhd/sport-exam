import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Header from "./components/layout/Header.tsx";
import Subject from "./pages/Subject.tsx";
import QuestionSession from "./components/subject/QuestionSession.tsx";
import Result from "./pages/Result.tsx";
import NotFound from "./pages/NotFound.tsx";
import YearLayout from "./components/layout/Subjectlayout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route index element={<App />} />
          <Route element={<YearLayout />}>
            <Route path=":year" element={<Subject />} />
            <Route path=":year/:subject" element={<QuestionSession />} />
          </Route>
          <Route path="result" element={<Result />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
