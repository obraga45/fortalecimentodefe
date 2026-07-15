"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TagFilters from "@/components/TagFilters";
import PostCard from "@/components/PostCard";
import LoginModal from "@/components/LoginModal";
import CreatePostForm from "@/components/CreatePostForm";
import { supabase } from "@/src/utils/supabase";
import { timeAgo } from "@/src/utils/timeAgo";
import type { Post, PostWithTimeAgo } from "@/src/types";
import { useAuth } from "@/src/hooks/useAuth";

// Sample posts for demo purposes if Supabase isn't configured
const samplePosts: Post[] = [
  {
    id: "1",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    content: "Levanto os meus olhos para os montes, de onde vem o meu socorro? O meu socorro vem do Senhor, que fez os céus e a terra.",
    reference: "Salmos 121:1-2",
    author_name: "Maria Silva",
    author_id: "demo-1",
    avatar_url: null,
    tag: "Força",
    reactions: { amen: 47, touched: 32, inspired: 19 },
  },
  {
    id: "2",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    content: "Não andes ansiosos por coisa alguma; antes, em tudo, pela oração e súplica, com ação de graças, sejam as vossas petições conhecidas diante de Deus.",
    reference: "Filipenses 4:6",
    author_name: "João Pereira",
    author_id: "demo-2",
    avatar_url: null,
    tag: "Paz",
    reactions: { amen: 78, touched: 45, inspired: 28 },
  },
  {
    id: "3",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    content: "Porque eu bem sei os planos que tenho para vós, diz o Senhor: planos de paz e não de mal, para vos dar um futuro e uma esperança.",
    reference: "Jeremias 29:11",
    author_name: "Luiza Costa",
    author_id: "demo-3",
    avatar_url: null,
    tag: "Esperança",
    reactions: { amen: 112, touched: 67, inspired: 41 },
  },
  {
    id: "4",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    content: "Deem graças ao Senhor, porque ele é bom; porque a sua benignidade dura para sempre.",
    reference: "Salmos 107:1",
    author_name: "Carlos Mendes",
    author_id: "demo-4",
    avatar_url: null,
    tag: "Gratidão",
    reactions: { amen: 65, touched: 38, inspired: 24 },
  },
];

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [activeTag, setActiveTag] = useState("Todos");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      // Try fetching from Supabase
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        // If Supabase fails or no data, use sample posts
        setPosts(samplePosts);
      } else {
        setPosts(data as unknown as Post[]);
      }
    } catch {
      setPosts(samplePosts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const postsWithTimeAgo: PostWithTimeAgo[] = posts.map((post) => ({
    ...post,
    time_ago: timeAgo(post.created_at),
  }));

  const filteredPosts = activeTag === "Todos"
    ? postsWithTimeAgo
    : postsWithTimeAgo.filter((post) => post.tag === activeTag);

  const handleShareClick = () => {
    if (user) {
      setIsCreateFormOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleCreatePostSubmit = async (data: Omit<Post, "id" | "reactions" | "time_ago" | "created_at" | "author_id">) => {
    try {
      if (user) {
        // Insert into Supabase
        const { data: insertedPost, error } = await supabase
          .from("posts")
          .insert({
            content: data.content,
            reference: data.reference,
            tag: data.tag,
            author_name: data.author_name,
            author_id: user.id,
            avatar_url: data.avatar_url,
            reactions: { amen: 0, touched: 0, inspired: 0 },
          })
          .select()
          .single();

        if (!error && insertedPost) {
          setPosts([insertedPost as unknown as Post, ...posts]);
        }
      } else {
        // Demo mode: add sample post
        const newPost: Post = {
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          ...data,
          author_id: "demo-new",
          reactions: { amen: 0, touched: 0, inspired: 0 },
        };
        setPosts([newPost, ...posts]);
      }
      setIsCreateFormOpen(false);
    } catch {
      // Fallback to demo mode
      const newPost: Post = {
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        ...data,
        author_id: "demo-new",
        reactions: { amen: 0, touched: 0, inspired: 0 },
      };
      setPosts([newPost, ...posts]);
      setIsCreateFormOpen(false);
    }
  };

  const handleReactionUpdate = async (postId: string, newReactions: Post["reactions"]) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, reactions: newReactions } : post
      )
    );

    // Update in Supabase if possible
    if (user) {
      try {
        await supabase
          .from("posts")
          .update({ reactions: newReactions })
          .eq("id", postId);
      } catch {
        // Ignore errors for reactions in demo mode
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={handleLoginClick} />
      <Hero onShareClick={handleShareClick} />
      <TagFilters onTagChange={setActiveTag as any} />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="break-inside-avoid">
                <PostCard post={post} onReactionUpdate={handleReactionUpdate} />
              </div>
            ))}
          </div>
        )}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
      />

      {isCreateFormOpen && (
        <CreatePostForm
          onClose={() => setIsCreateFormOpen(false)}
          onSubmit={handleCreatePostSubmit}
        />
      )}
    </div>
  );
}
