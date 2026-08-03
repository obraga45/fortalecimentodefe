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
    <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pb-4 sm:pb-6">
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 -mx-1 px-1 sm:flex-wrap sm:justify-center sm:overflow-visible scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className={`shrink-0 px-4 py-2.5 sm:py-2 min-h-[2.75rem] sm:min-h-0 rounded-full text-sm font-medium transition-all whitespace-nowrap snap-start ${
              activeTag === tag
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
