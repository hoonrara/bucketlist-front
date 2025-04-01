// src/pages/ExplorePage.jsx
import { useEffect, useState } from "react";
import BucketCard from "../components/BucketCard";

export default function ExplorePage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchPublicBuckets = async () => {
      try {
        const res = await fetch("http://localhost:8080/buckets/public");
        if (!res.ok) throw new Error("불러오기 실패");

        const data = await res.json();
        setList(data);
      } catch (err) {
        console.error(err);
        alert("❌ 공개 버킷 불러오기에 실패했습니다.");
      }
    };

    fetchPublicBuckets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🌍 공개 버킷 탐색</h1>

      {list.length === 0 ? (
        <p className="text-gray-500">아직 공개된 버킷이 없습니다.</p>
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
