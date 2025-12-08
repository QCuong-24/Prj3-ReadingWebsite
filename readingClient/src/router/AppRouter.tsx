import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { NovelPage } from "../pages/NovelPage";
import { ChapterPage } from "../pages/ChapterPage";
import { Layout } from "../components/Layout";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/novel/:id" element={<NovelPage />} />
        <Route path="/novel/:novelId/chapter/:chapterId" element={<ChapterPage />} />
      </Route>
    </Routes>
  );
};