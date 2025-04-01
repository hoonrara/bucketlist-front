// src/components/LikeButton.jsx
import { useAuth } from "../contexts/authContext";

export default function LikeButton({ bucketId, likedByMe, likeCount, onLike }) {
  const { user } = useAuth();

  const handleLike = async (e) => {
    e.stopPropagation(); // 카드 클릭 방지
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/buckets/${bucketId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("좋아요 실패");

      onLike(); // 부모에서 상태 반영
    } catch (err) {
      console.error(err);
      alert("❌ 좋아요 처리 실패");
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`text-sm font-medium px-2 py-1 rounded-full border ${
        likedByMe
          ? "bg-pink-100 text-pink-600 border-pink-300"
          : "bg-gray-100 text-gray-600 border-gray-300"
      }`}
    >
      ❤️ {likeCount}
    </button>
  );
}
