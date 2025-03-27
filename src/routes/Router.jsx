import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Header from "../components/Header";

const HomePage = lazy(() => import("../pages/HomePage"));
const CreatePage = lazy(() => import("../pages/CreatePage"));
const DetailPage = lazy(() => import("../pages/DetailPage"));

export default function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<div className="p-6 text-xl">⏳ 페이지 로딩 중...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
