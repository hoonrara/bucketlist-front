import { useEffect, useState } from "react";
import BucketCard from "../components/BucketCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function HomePage() {
  const [filter, setFilter] = useState("ALL");
  const [list, setList] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bucketList")) || [];
    const patched = saved.map((item) =>
      item.createdAt ? item : { ...item, createdAt: new Date().toISOString() }
    );
    setList(patched);
  }, []);

  const displayList = list.filter((item) => {
    if (filter === "COMPLETED") return item.isCompleted;
    if (filter === "NOT_COMPLETED") return !item.isCompleted;
    return true;
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const currentList = [...list];
    const draggedItemId = displayList[result.source.index].id;
    const fromIndex = currentList.findIndex((item) => item.id === draggedItemId);
    const [movedItem] = currentList.splice(fromIndex, 1);
    const toIndex = result.destination.index;

    const destinationId = displayList[toIndex]?.id;
    const insertIndex = destinationId
      ? currentList.findIndex((item) => item.id === destinationId)
      : currentList.length;

    currentList.splice(insertIndex, 0, movedItem);
    setList(currentList);
    localStorage.setItem("bucketList", JSON.stringify(currentList));
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">🎯 나의 버킷리스트</h1>

      <div className="flex flex-wrap gap-3">
        <button onClick={() => setFilter("ALL")} className={`px-4 py-1 rounded-full text-sm font-medium ${filter === "ALL" ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-700"}`}>전체</button>
        <button onClick={() => setFilter("NOT_COMPLETED")} className={`px-4 py-1 rounded-full text-sm font-medium ${filter === "NOT_COMPLETED" ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-700"}`}>미완료</button>
        <button onClick={() => setFilter("COMPLETED")} className={`px-4 py-1 rounded-full text-sm font-medium ${filter === "COMPLETED" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}>완료</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="bucketList">
          {(provided) => (
            <div
              className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {displayList.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <BucketCard {...item} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}