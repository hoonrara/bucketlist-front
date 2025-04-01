// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";


export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("로그인 실패");

      const data = await res.json();
      localStorage.setItem("token", data.token);

      const meRes = await fetch("http://localhost:8080/auth/me", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      const me = await meRes.json();
      setUser(me); // 🔥 user 설정




      alert("✅ 로그인 성공!");
      navigate("/");
    } catch (err) {
      alert("❌ 로그인 오류: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔐 로그인</h1>
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
        <button className="w-full bg-indigo-500 text-white py-2 rounded">로그인</button>
      </form>
    </div>
  );
}
