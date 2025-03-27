import { useNavigate } from "react-router-dom";

export default function BucketCard({ id, title, description, category, isCompleted }) {
    const navigate = useNavigate();
  
    const handleClick = () => {
      navigate(`/detail/${id}`);
    };
  
    return (
      <div
        onClick={handleClick}
        className="cursor-pointer bg-white rounded-2xl shadow-md p-5 w-full max-w-md hover:scale-105 transition"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{title}</h2>
          <span className={`text-sm px-2 py-1 rounded-full ${
            isCompleted ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
          }`}>
            {isCompleted ? "완료" : "미완료"}
          </span>
        </div>
        <p className="text-gray-600 mb-2">{description}</p>
        <div className="text-sm text-gray-500">카테고리: {category}</div>
      </div>
    );
  }
  