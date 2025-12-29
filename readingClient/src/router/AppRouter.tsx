import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { NovelPage } from "../pages/NovelPage";
import { ChapterPage } from "../pages/ChapterPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProtectedRoute } from "./ProtectedRouter";
import { Layout } from "../components/Layout";
import { ManagerRoute } from "./ManagerRouter";
import { ChapterAddPage } from "../pages/ChapterAddPage";
import { ChapterEditPage } from "../pages/ChapterEditPage";
import { NovelAddPage } from "../pages/NovelAddPage";
import { NovelEditPage } from "../pages/NovelEditPage";
import { ProfilePage } from "../pages/ProfilePage";
import { ShelfPage } from "../pages/ShelfPage";
import { AdminRoute } from "./AdminRouter";
import { AdminPage } from "../pages/AdminPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/novel/:id" element={<NovelPage />} />

        <Route
          path="/novel/add"
          element={
            <ManagerRoute>
              <NovelAddPage />
            </ManagerRoute>
          }
        />

        <Route
          path="/novel/:novelId/edit"
          element={
            <ManagerRoute>
              <NovelEditPage />
            </ManagerRoute>
          }
        />

        <Route
          path="/novel/:novelId/chapter/:chapterId"
          element={
            <ProtectedRoute>
              <ChapterPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/novel/:novelId/chapter/add"
          element={
            <ManagerRoute>
              <ChapterAddPage />
            </ManagerRoute>
          }
        />

        <Route
          path="/novel/:novelId/chapter/:chapterId/edit"
          element={
            <ManagerRoute>
              <ChapterEditPage />
            </ManagerRoute>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shelf"
          element={
            <ProtectedRoute>
              <ShelfPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
};