"use client";

import { useState } from "react";

const tags = ["Todos", "Força", "Gratidão", "Paz", "Esperança"] as const;

type Tag = typeof tags[number];

export default function TagFilters({ onTagChange }: { onTagChange: (tag: Tag) => void }) {
  const [activeTag, setActiveTag] = useState<Tag>("Todos");

  const handleTagClick = (tag: Tag) => {
    setActiveTag(tag);
    onTagChange(tag);
  };

  return (
    <div className="w-full flex gap-2 sm:gap-3 justify-start sm:justify-center px-3 sm:px-6 lg:px-8 pb-6 overflow-x-auto">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
          activeTag === tag
            ? "bg-primary text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
