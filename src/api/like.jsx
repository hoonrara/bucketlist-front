export async function toggleLike(bucketId) {
    const res = await fetch(`http://localhost:8080/buckets/${bucketId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    if (!res.ok) throw new Error("좋아요 요청 실패");
  }
  