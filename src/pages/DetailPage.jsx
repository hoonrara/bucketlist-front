import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editTitleMode, setEditTitleMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [selectingDate, setSelectingDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [review, setReview] = useState("");
  const [editReviewMode, setEditReviewMode] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bucketList")) || [];
    const found = saved.find((i) => i.id === id);
    if (found) {
      setItem(found);
      setTitle(found.title);
      setDescription(found.description);
      setImages(found.images || []);
      setReview(found.review || "");
    }
  }, [id]);

  const updateLocalStorage = (updatedItem) => {
    const saved = JSON.parse(localStorage.getItem("bucketList")) || [];
    const updatedList = saved.map((i) => (i.id === id ? updatedItem : i));
    localStorage.setItem("bucketList", JSON.stringify(updatedList));
  };

  const handleSave = () => {
    const updated = { ...item, title, description };
    setItem(updated);
    setEditMode(false);
    updateLocalStorage(updated);
  };

  const handleTitleSave = () => {
    const updated = { ...item, title };
    setItem(updated);
    setEditTitleMode(false);
    updateLocalStorage(updated);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newImages) => {
      const allImages = [...images, ...newImages];
      const updated = { ...item, images: allImages };
      setImages(allImages);
      setItem(updated);
      updateLocalStorage(updated);
    });
  };

  const handleImageDelete = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updated = { ...item, images: updatedImages };
    setImages(updatedImages);
    setItem(updated);
    updateLocalStorage(updated);
  };

  const handleToggleClick = () => {
    if (!item.isCompleted) {
      setSelectingDate(true);
    } else {
      const updated = { ...item, isCompleted: false, completedAt: null };
      setItem(updated);
      updateLocalStorage(updated);
    }
  };

  const handleDateSelect = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const updated = {
      ...item,
      isCompleted: true,
      completedAt: formattedDate,
    };
    setItem(updated);
    updateLocalStorage(updated);
    setSelectedDate(null);
    setSelectingDate(false);
  };

  const handleReviewSave = () => {
    const updated = { ...item, review };
    setItem(updated);
    setEditReviewMode(false);
    updateLocalStorage(updated);
  };

  if (!item) {
    return <div className="p-6 text-red-500 text-lg">❌ 해당 항목을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* 상단 박스 */}
      <div className="bg-white shadow-md rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            {editTitleMode ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold w-full border-b border-gray-300 focus:outline-none"
              />
            ) : (
              <h1 className="text-2xl font-bold">{title}</h1>
            )}
            <p className="text-sm text-gray-500 mt-1">
              카테고리: <span className="font-semibold text-indigo-600">{item.category}</span>
            </p>
          </div>
          <div className="text-right space-y-2">
            <div className="flex items-center justify-end gap-2">
              <span className={`text-sm px-3 py-1 rounded-full ${
                item.isCompleted ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
              }`}>
                {item.isCompleted ? "완료됨" : "미완료"}
              </span>
              <button
                onClick={() => setEditTitleMode(true)}
                className="text-sm text-indigo-500 underline whitespace-nowrap"
              >
                ✏️ 제목 수정
              </button>
            </div>
            <button
              onClick={handleToggleClick}
              className={`text-sm px-3 py-1 rounded-md font-semibold w-full text-center ${
                item.isCompleted
                  ? "bg-yellow-400 text-white hover:bg-yellow-500"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {item.isCompleted ? "미완료로 변경" : "완료 날짜 선택"}
            </button>
          </div>
        </div>

        {editTitleMode && (
          <div className="flex gap-2">
            <button
              onClick={handleTitleSave}
              className="text-sm bg-indigo-500 text-white px-2 py-1 rounded"
            >
              저장
            </button>
            <button
              onClick={() => {
                setEditTitleMode(false);
                setTitle(item.title);
              }}
              className="text-sm text-gray-500"
            >
              취소
            </button>
          </div>
        )}

        {selectingDate && (
          <DatePicker
            selected={selectedDate}
            onChange={handleDateSelect}
            inline
            className="mt-2 border border-gray-300 rounded-md p-2"
          />
        )}

        {item.isCompleted && item.completedAt && (
          <div className="text-sm text-gray-500 text-right">
            ✅ 완료 날짜: {item.completedAt}
          </div>
        )}
      </div>

      {/* 중간 박스 (사진 여러 장 업로드) */}
      <div className="bg-white shadow-md rounded-xl p-4 text-center min-h-48 flex flex-col justify-center items-center">
        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {images.map((src, index) => (
              <div key={index} className="relative">
                <img src={src} alt={`upload-${index}`} className="w-full max-w-xs rounded-md" />
                <button
                  onClick={() => handleImageDelete(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-2">📸 사진을 업로드 해보세요!</p>
        )}
        <label className="mt-4 cursor-pointer bg-indigo-100 text-indigo-700 px-4 py-2 rounded hover:bg-indigo-200">
          사진 업로드
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* 설명 박스 */}
      <div className="bg-white shadow-md rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">📝 설명</h2>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="text-sm text-indigo-500 underline">
              ✏️ 수정하기
            </button>
          )}
        </div>
        {editMode ? (
          <>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              rows="4"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSave}
                className="bg-indigo-500 text-white px-4 py-1 rounded-md"
              >
                저장
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setDescription(item.description);
                }}
                className="text-gray-500"
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
        )}
      </div>

      {/* 후기 박스 */}
      {item.isCompleted && (
        <div className="bg-white shadow-md rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">💬 후기</h2>
            {!editReviewMode && (
              <button
                onClick={() => setEditReviewMode(true)}
                className="text-sm text-indigo-500 underline"
              >
                ✏️ 후기 작성
              </button>
            )}
          </div>

          {editReviewMode ? (
            <>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                rows="4"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleReviewSave}
                  className="bg-indigo-500 text-white px-4 py-1 rounded-md"
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setEditReviewMode(false);
                    setReview(item.review || "");
                  }}
                  className="text-gray-500"
                >
                  취소
                </button>
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