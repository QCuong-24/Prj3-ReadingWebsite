import { ChapterDTO } from './novel.types';

export interface ReadingHistory {
  chapterId: number;
  novelId: number;
  chapterTitle: string;
  chapterNumber: number;
  lastReadAt: string; // ISO date string
}

export type Bookmark = ChapterDTO;