import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sortPostsByDate = (posts: any[] | any) => {
  if (!Array.isArray(posts)) {
    return [];
  }
  return posts.sort((a: any, b: any) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return dateB - dateA; // Sort in descending order (most recent first)
  });
};