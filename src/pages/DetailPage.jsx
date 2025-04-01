// src/pages/DetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editTitleMode, setEditTitleMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [review, setReview] = useState("");
  const [editReviewMode, setEditReviewMode] = useState(false);
  const [selectingDate, setSelectingDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [categories] = useState(["TRAVEL", "BOOK", "GROWTH", "HOBBY", "EXERCISE", "EMOTION", "CHALLENGE"]);
  const [editingCategory, setEditingCategory] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:8080/buckets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("❌ 버킷 조회 실패");
        const data = await res.json();
        setItem(data);
        setTitle(data.title);
        setDescription(data.description);
        setReview(data.review || "");
      } catch (err) {
        alert(err.message);
      }
    };
    fetchDetail();
  }, [id, token]);

  const patch = async (url, body) => {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("❌ 수정 실패");
    const updated = await res.json();
    setItem(updated);
  };

  const toggleLike = async () => {
    await fetch(`http://localhost:8080/buckets/${id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await fetch(`http://localhost:8080/buckets/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setItem(await res.json());
  };

  const deleteBucket = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;
    await fetch(`http://localhost:8080/buckets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("삭제되었습니다");
    navigate("/");
  };

  if (!item) return <div className="p-6 text-red-500">❌ 항목을 찾을 수 없습니다.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="bg-white shadow-md rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            {editTitleMode ? (
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="text-2xl font-bold border-b border-gray-300" />
            ) : (
              <h1 className="text-2xl font-bold">{item.title}</h1>
            )}
            <div className="text-sm text-gray-500 mt-1">
              카테고리: {editingCategory ? (
                <select
                  value={item.category}
                  onChange={(e) => {
                    patch(`http://localhost:8080/buckets/${id}/category`, { category: e.target.value });
                    setEditingCategory(false);
                  }}
                  className="ml-2 border rounded px-2 py-1 text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              ) : (
                <span className="text-indigo-600 font-semibold cursor-pointer ml-1" onClick={() => setEditingCategory(true)}>
                  {item.category}
                </span>
              )}
            </div>
          </div>

          <div className="text-right space-y-2">
            <div className="flex gap-2 items-center justify-end">
              <span className={`text-sm px-3 py-1 rounded-full ${item.completed ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}>{item.completed ? "완료됨" : "미완료"}</span>
              <button onClick={() => setEditTitleMode(true)} className="text-sm px-2 py-1 bg-indigo-500 text-white rounded">✏️ 제목 수정</button>
            </div>
            <button onClick={() => {
              if (item.completed) {
                patch(`http://localhost:8080/buckets/${id}/completion`, { isCompleted: false, completedAt: null });
              } else {
                setSelectingDate(true);
              }
            }} className="text-sm px-3 py-1 rounded-md font-semibold w-full text-center bg-green-500 text-white hover:bg-green-600">
              {item.completed ? "미완료로 변경" : "완료 날짜 선택"}
            </button>
          </div>
        </div>

        {editTitleMode && (
          <div className="flex gap-2 mt-2">
            <button onClick={() => { patch(`http://localhost:8080/buckets/${id}/title`, { title }); setEditTitleMode(false); }} className="bg-indigo-500 text-white px-3 py-1 rounded text-sm">저장</button>
            <button onClick={() => { setEditTitleMode(false); setTitle(item.title); }} className="text-sm text-gray-500">취소</button>
          </div>
        )}

        {selectingDate && (
          <DatePicker selected={selectedDate} onChange={(date) => {
            const formatted = date.toISOString().split("T")[0];
            patch(`http://localhost:8080/buckets/${id}/completion`, { isCompleted: true, completedAt: formatted });
            setSelectingDate(false);
            setSelectedDate(null);
          }} inline className="mt-2 border border-gray-300 rounded-md p-2" />
        )}

        {item.completed && item.completedAt && (
          <div className="text-sm text-gray-500 text-right">✅ 완료 날짜: {item.completedAt}</div>
        )}
      </div>

      {/* 이미지 공간 (인스타그램 스타일) */}
      <div className="bg-white shadow-md rounded-xl h-64 flex items-center justify-center text-gray-400 text-sm">
        📸 여기에 사진이 표시됩니다. (추후 업로드 예정)
      </div>

      {/* 공유/좋아요/삭제 컨트롤 */}
      <div className="bg-white shadow-md rounded-xl p-4 space-y-3">
        <div className="flex gap-2 items-center text-sm">
          <span>🔒 공개 여부: {item.public ? "공개" : "비공개"}</span>
          <button onClick={() => patch(`http://localhost:8080/buckets/${id}/publicity`, { isPublic: !item.public })} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">공개 설정 변경</button>
        </div>

        <div className="flex gap-2 items-center text-sm">
          <span>❤️ 좋아요 {item.likeCount}개</span>
          <button onClick={toggleLike} className="px-2 py-1 bg-pink-100 text-pink-700 rounded">좋아요</button>
        </div>

        <button onClick={deleteBucket} className="text-sm text-red-500 underline">삭제하기</button>
      </div>

      <div className="bg-white shadow-md rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">📝 설명</h2>
          {!editMode && <button onClick={() => setEditMode(true)} className="text-sm px-2 py-1 bg-indigo-100 text-indigo-700 rounded">수정</button>}
        </div>
        {editMode ? (
          <>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" rows="4" />
            <div className="flex gap-2 mt-2">
              <button onClick={() => { patch(`http://localhost:8080/buckets/${id}/description`, { description }); setEditMode(false); }} className="bg-indigo-500 text-white px-4 py-1 rounded-md">저장</button>
              <button onClick={() => { setEditMode(false); setDescription(item.description); }} className="text-gray-500">취소</button>
            </div>
          </>
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
        )}
      </div>

      {item.completed && (
        <div className="bg-white shadow-md rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">💬 후기</h2>
            {!editReviewMode && <button onClick={() => setEditReviewMode(true)} className="text-sm px-2 py-1 bg-indigo-100 text-indigo-700 rounded">작성</button>}
          </div>
          {editReviewMode ? (
            <>
              <textarea value={review} onChange={(e) => setReview(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" rows="4" />
              <div className="flex gap-2 mt-2">
                <button onClick={() => { patch(`http://localhost:8080/buckets/${id}/review`, { review }); setEditReviewMode(false); }} className="bg-indigo-500 text-white px-4 py-1 rounded-md">저장</button>
                <button onClick={() => { setEditReviewMode(false); setReview(item.review || ""); }} className="text-gray-500">취소</button>
              </div>
            </>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{review || "아직 후기가 없습니다."}</p>
          )}
        </div>
      )}
    </div>
  );
}