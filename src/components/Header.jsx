import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-10">
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        🎯 My Bucket
      </Link>
      <nav className="flex gap-4">
        <Link
          to="/"
          className={`text-sm font-medium ${isActive("/") ? "text-indigo-600" : "text-gray-500 hover:text-indigo-500"}`}
        >
          📋 목록
        </Link>
        <Link
          to="/create"
          className={`text-sm font-medium ${isActive("/create") ? "text-indigo-600" : "text-gray-500 hover:text-indigo-500"}`}
        >
          ➕ 추가
        </Link>
      </nav>
    </header>
  );
}
