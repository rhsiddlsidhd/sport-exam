import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Header from "./components/layout/Header.tsx";
import YearPage from "./pages/YearPage.tsx";
import SubjectPage from "./pages/SubjectPage.tsx";
import ReviewPage from "./pages/ReviewPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import NotesPage from "./pages/NotesPage.tsx";
import YearLayout from "./components/layout/YearLayout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route index element={<App />} />
          <Route element={<YearLayout />}>
            <Route path=":year" element={<YearPage />} />
            <Route path=":year/:subject" element={<SubjectPage />} />
          </Route>
          <Route path="review" element={<ReviewPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
