import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-10">
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        🎯 My Bucket
      </Link>

      <nav className="flex gap-4 items-center">
        <Link
          to="/explore"
          className={`text-sm font-medium ${
            isActive("/explore")
              ? "text-indigo-600"
              : "text-gray-500 hover:text-indigo-500"
          }`}
        >
          🌍 공개버킷
        </Link>

        {user ? (
          <>
            <Link
              to="/liked"
              className={`text-sm font-medium ${
                isActive("/liked")
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-indigo-500"
              }`}
            >
              ❤️ 찜한 버킷
            </Link>
            <span className="text-sm text-gray-600">👤 {user.nickname}</span>
            <button
              onClick={logout}
              className="text-sm font-medium text-red-500 hover:text-red-600"
            >
              🔓 로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-500 hover:text-indigo-500"
            >
              🔐 로그인
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium text-gray-500 hover:text-indigo-500"
            >
              📝 회원가입
            </Link>
          </>
        )}
        <Link
          to="/"
          className={`text-sm font-medium ${
            isActive("/") ? "text-indigo-600" : "text-gray-500 hover:text-indigo-500"
          }`}
        >
          📋 목록
        </Link>
        <Link
          to="/create"
          className={`text-sm font-medium ${
            isActive("/create")
              ? "text-indigo-600"
              : "text-gray-500 hover:text-indigo-500"
          }`}
        >
          ➕ 추가
        </Link>
      </nav>
    </header>
  );
}
