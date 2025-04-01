import { useEffect, useState } from "react";
import BucketCard from "../components/BucketCard";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { user, loading } = useAuth();
  const [filter, setFilter] = useState("ALL");
  const [list, setList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        setIsFetching(true);

        let url = "";
        const headers = {};

        if (user) {
          // 로그인 유저: 내 버킷 + 필터링
          const queryParams = [];
          if (filter === "COMPLETED") queryParams.push("completed=true");
          else if (filter === "NOT_COMPLETED") queryParams.push("completed=false");

          const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
          url = `http://localhost:8080/buckets${queryString}`;
          headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
        } else {
          // 비로그인 유저: 공개 버킷
          url = `http://localhost:8080/buckets/public`;
        }

        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error("버킷 불러오기 실패");

        let data = await res.json();

        // 비로그인일 때 필터링은 프론트에서
        if (!user && filter !== "ALL") {
          const isCompleted = filter === "COMPLETED";
          data = data.filter((item) => item.isCompleted === isCompleted);
        }

        setList(data);
      } catch (err) {
        console.error(err);
        alert("❌ 버킷 불러오기 실패");
      } finally {
        setIsFetching(false);
      }
    };

    fetchBuckets();
  }, [user, filter]);

  if (loading || isFetching) {
    return <div className="p-6 text-lg">⏳ 버킷 리스트 로딩 중...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-center">
      {/* 제목 */}
      <h1 className="text-3xl font-bold">
        {user ? "🎯 나의 버킷리스트" : "🌍 공개 버킷 리스트"}
      </h1>

      {/* 필터 버튼 */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            filter === "ALL"
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setFilter("NOT_COMPLETED")}
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            filter === "NOT_COMPLETED"
              ? "bg-yellow-400 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          미완료
        </button>
        <button
          onClick={() => setFilter("COMPLETED")}
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            filter === "COMPLETED"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          완료
        </button>
      </div>

      {/* 로그인 유도 */}
      {!user && (
        <div className="text-sm text-gray-600">
          🔒 나만의 버킷리스트를 만들려면{" "}
          <button
            onClick={() => navigate("/login")}
            className="underline text-indigo-600 font-semibold"
          >
            로그인
          </button>
          해주세요!
        </div>
      )}

      {/* 버킷 카드 or 없음 */}
      {list.length === 0 ? (
        <p className="text-gray-500">😢 보여줄 버킷이 없습니다.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {list.map((item) => (
            <BucketCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
