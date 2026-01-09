import { ChapterDTO } from './novel.types';

export interface ReadingHistory {
  chapterId: number;
  novelId: number;
  novelTitle: string;
  chapterTitle: string;
  chapterNumber: number;
  lastReadAt: string; // ISO date string
}

export type Bookmark = ChapterDTO;