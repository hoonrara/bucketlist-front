// src/pages/CreatePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "TRAVEL",
    isPublic: false,
  });

  const navigate = useNavigate();

  const categories = [
    "TRAVEL", "BOOK", "GROWTH", "HOBBY", "EXERCISE", "EMOTION", "CHALLENGE",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ 로그인 후 이용해주세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/buckets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "버킷 생성 실패");
      }

      alert("✅ 버킷이 성공적으로 추가되었습니다!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("❌ 오류: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">➕ 버킷리스트 추가</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="예) 유럽 여행 가기"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">설명</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="예) 바르셀로나에서 감성사진 찍기"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">카테고리</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <label htmlFor="isPublic" className="text-sm text-gray-600">
            공개 여부 (체크 시 전체에게 공개됩니다)
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-md py-2 font-semibold transition"
        >
          저장하기
        </button>
      </form>
    </div>
  );
}
