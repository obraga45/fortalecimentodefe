"use client";

import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { Post } from "@/src/types";

const tags = ["Força", "Gratidão", "Paz", "Esperança"] as const;

export default function CreatePostForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: Omit<Post, "id" | "reactions" | "time_ago" | "created_at" | "author_id">) => void;
}) {
  const [content, setContent] = useState("");
  const [reference, setReference] = useState("");
  const [tag, setTag] = useState<typeof tags[number]>("Força");
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get current user data (with demo fallback)
    const author_name = user
      ? user.user_metadata?.full_name || "Comunidade"
      : "Usuário Demo";
    const avatar_url = user
      ? user.user_metadata?.avatar_url || null
      : null;

    onSubmit({
      content,
      reference: reference || null,
      tag,
      author_name,
      avatar_url,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-800">
            Partilhar uma Reflexão
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Versículo ou Reflexão
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-28 sm:h-32 text-sm"
              placeholder="Escreva o versículo ou a reflexão que deseja partilhar..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Referência (ex: Salmos 121:1-2)
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              placeholder="Digite a referência bíblica ou deixe em branco"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    tag === t
                      ? "bg-primary text-white"
                      : "bg-stone-100 text-slate-700 hover:bg-stone-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 sm:py-3 border border-stone-200 rounded-xl text-slate-700 font-medium hover:bg-stone-50 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 sm:py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors text-sm"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
