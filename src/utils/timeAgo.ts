export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'agora mesmo';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `há ${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `há ${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `há ${diffInDays}d`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `há ${diffInMonths} meses`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return `há ${diffInYears} anos`;
}

