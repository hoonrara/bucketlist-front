// src/pages/SignupPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "", nickname: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("회원가입 실패");

      alert("🎉 회원가입 성공! 로그인해주세요");
      navigate("/login");
    } catch (err) {
      alert("❌ 회원가입 오류: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">✍️ 회원가입</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="이메일"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="비밀번호"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          placeholder="닉네임"
          className="w-full border p-2 rounded"
          required
        />
        <button className="w-full bg-indigo-500 text-white py-2 rounded">회원가입</button>
      </form>
    </div>
  );
}
