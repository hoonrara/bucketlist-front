import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "TRAVEL",
  });

  const navigate = useNavigate();

  const categories = ["TRAVEL", "BOOK", "GROWTH", "HOBBY", "EXERCISE", "EMOTION", "CHALLENGE"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      id: Date.now().toString(),
      ...form,
      isCompleted: false,
    };

    const saved = JSON.parse(localStorage.getItem("bucketList")) || [];
    saved.push(newItem);
    localStorage.setItem("bucketList", JSON.stringify(saved));

    navigate("/"); // 홈으로 이동
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
            className="w-full border border-gray-300 rounded-md p-2"
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
            className="w-full border border-gray-300 rounded-md p-2"
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
