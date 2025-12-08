export interface ChapterDTO {
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
}