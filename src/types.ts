export interface Post {
  id: string;
  created_at: string;
  content: string;
  reference: string | null;
  author_name: string;
  author_id: string;
  avatar_url: string | null;
  tag: string;
  reactions: {
    amen: number;
    touched: number;
    inspired: number;
  };
}

export interface PostWithTimeAgo extends Post {
  time_ago: string;
}

