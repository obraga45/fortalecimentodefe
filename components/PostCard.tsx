"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Post } from "@/src/types";

const getTagColor = (tag: string) => {
  switch (tag) {
    case "Força":
      return "bg-green-100 text-green-800";
    case "Gratidão":
      return "bg-yellow-100 text-yellow-800";
    case "Paz":
      return "bg-blue-100 text-blue-800";
    case "Esperança":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const AvatarFallback = ({ name, className = "" }: { name: string; className?: string }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm sm:text-base ${className}`}>
      {initials}
    </div>
  );
};

interface PostCardProps {
  post: any; // Use any for compatibility
  onReactionUpdate?: (postId: string, reactions: any) => void;
}

export default function PostCard({ post, onReactionUpdate }: PostCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [reactions, setReactions] = useState(post.reactions);
  const [isSharing, setIsSharing] = useState(false);

  const handleReaction = (type: keyof typeof reactions) => {
    const newReactions = {
      ...reactions,
      [type]: reactions[type] + 1,
    };
    setReactions(newReactions);
    onReactionUpdate?.(post.id, newReactions);
  };

  const dataURLToBlob = (dataurl: string): Blob => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#FDFBF7",
        skipAutoScale: true,
        cacheBust: true,
        skipFonts: true, // Skip external fonts to avoid CORS errors
        includeQueryParams: false,
        style: {
          fontFamily: "Georgia, serif, system-ui, sans-serif", // Fallback fonts
        },
      });

      const blob = dataURLToBlob(dataUrl);
      const file = new File([blob], "post-fe.png", { type: "image/png" });

      const shareText = `${post.content}\n\n${post.reference}\n\nlido em fortalecimentodefe.pt`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Fortalecimento de Fé",
          text: shareText,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: "Fortalecimento de Fé",
          text: shareText,
        });
      } else {
        const link = document.createElement("a");
        link.download = "post-fe.png";
        link.href = dataUrl;
        link.click();
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
          "_blank"
        );
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback: just share text if image fails
      const shareText = `${post.content}\n\n${post.reference}\n\nlido em fortalecimentodefe.pt`;
      if (navigator.share) {
        await navigator.share({
          title: "Fortalecimento de Fé",
          text: shareText,
        });
      } else {
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
          "_blank"
        );
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div>
      <div
        ref={cardRef}
        className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 sm:p-5 w-full"
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          {post.avatar_url ? (
            <img
              src={post.avatar_url}
              alt={post.author_name}
              crossOrigin="anonymous"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <AvatarFallback
            name={post.author_name}
            className={post.avatar_url ? "hidden" : ""}
          />

          {/* Author Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-slate-800 font-bold truncate text-sm sm:text-base">
                {post.author_name}
              </span>
              <span className="text-slate-400 text-xs sm:text-sm">@comunidade</span>
              <span className="text-slate-400 text-xs sm:text-sm">• {post.time_ago}</span>
            </div>
          </div>

          {/* Verified Badge */}
          <span className="text-primary text-lg sm:text-xl flex-shrink-0">✝️</span>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="font-serif text-base sm:text-lg leading-relaxed text-slate-800 mb-2">
            {post.content}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif italic text-primary text-sm sm:text-base">
              {post.reference}
            </span>
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getTagColor(
                post.tag
              )}`}
            >
              {post.tag}
            </span>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          {/* Reaction Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => handleReaction("amen")}
              className="flex items-center gap-1 text-slate-400 hover:text-green-600 transition-colors"
            >
              <span className="text-lg sm:text-base">🙏</span>
              <span className="text-xs sm:text-sm">{reactions.amen}</span>
            </button>
            <button
              onClick={() => handleReaction("touched")}
              className="flex items-center gap-1 text-slate-400 hover:text-pink-600 transition-colors"
            >
              <span className="text-lg sm:text-base">🤍</span>
              <span className="text-xs sm:text-sm">{reactions.touched}</span>
            </button>
            <button
              onClick={() => handleReaction("inspired")}
              className="flex items-center gap-1 text-slate-400 hover:text-yellow-600 transition-colors"
            >
              <span className="text-lg sm:text-base">✨</span>
              <span className="text-xs sm:text-sm">{reactions.inspired}</span>
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center gap-1 text-slate-400 hover:text-primary transition-colors disabled:opacity-50"
          >
            <span className="text-lg sm:text-base">📤</span>
            <span className="text-xs sm:text-sm">Partilhar</span>
          </button>
        </div>

        {/* Watermark (only visible in exported image) */}
        <div className="mt-3 pt-2 border-t border-stone-50 text-center text-xs text-slate-300">
          lido em fortalecimentodefe.pt
        </div>
      </div>
    </div>
  );
}
