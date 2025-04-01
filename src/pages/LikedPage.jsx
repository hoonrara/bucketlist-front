import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import BucketCard from "../components/BucketCard";

export default function LikedPage() {
  const { loading } = useAuth();
  const [list, setList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchLikedBuckets = async () => {
      try {
        setIsFetching(true);
        const res = await fetch("http://localhost:8080/buckets/liked", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("좋아요한 버킷 불러오기 실패");

        const data = await res.json();
        setList(data);
      } catch (err) {
        console.error(err);
        alert("❌ 좋아요한 버킷 불러오기 실패");
      } finally {
        setIsFetching(false);
      }
    };

    fetchLikedBuckets();
  }, []);

  if (loading || isFetching) {
    return <div className="p-6 text-lg">⏳ 로딩 중...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-center">
      <h1 className="text-3xl font-bold">❤️ 좋아요한 버킷</h1>
      {list.length === 0 ? (
        <p className="text-gray-500">좋아요한 버킷이 없습니다.</p>
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
