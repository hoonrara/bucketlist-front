import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Header from "../components/Header";
import ProtectedRoute from "./ProtectedRoute"; // 🔐 로그인 보호용

const HomePage = lazy(() => import("../pages/HomePage"));
const CreatePage = lazy(() => import("../pages/CreatePage"));
const DetailPage = lazy(() => import("../pages/DetailPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));
const ExplorePage = lazy(() => import("../pages/ExplorePage"));
const LikedPage = lazy(() => import("../pages/LikedPage")); // ✅ 추가

export default function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense
        fallback={<div className="p-6 text-xl">⏳ 페이지 로딩 중...</div>}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 보호 페이지들 */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/liked"
            element={
              <ProtectedRoute>
                <LikedPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
