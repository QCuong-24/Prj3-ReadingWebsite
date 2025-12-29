export interface ChapterDTO {
  id?: number;
  novelId: number;
  title: string;
  chapterNumber: number;
  updatedAt?: string;
}

export interface ChapterDetailDTO {
  id?: number;
  novelId: number;
  title: string;
  chapterNumber: number;
  content: string;
  updatedAt?: string;
}

export interface GenreDTO {
  id?: number;
  name: string;
}

export interface NovelDTO {
  id?: number;
  title: string;
  description?: string;
  author?: string;
  status: string; // "Ongoing" | "Finished"
  publicationDate?: string;
  postUserId?: number;
  coverImageUrl?: string;
  views: number;
  followers: number;
}

export interface CommentDTO {
  id: number;
  userId: number;
  userName: string;
  avatarUrl?: string;
  novelId: number;
  chapterId?: number;
  chapterNumber?: number;
  replyToId?: number;
  content: string;
  createdAt: string; // ISO string
}