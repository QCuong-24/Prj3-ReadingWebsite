export interface SearchResult<T> {
    items: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    executionTime: number;
}

export interface NovelSearchResult {
    novelId: number;
    title: string;
    description: string;
    author: string;
    status: string;
    genres: string[];
    views: number;
    followers: number;
}

export interface ChapterSearchResult {
    chapterId: number;
    chapterTitle: string;
    content: string;
    novelId: number;
    novelTitle: string;
    novelStatus: string;
    novelGenres: string[];
    chapterNumber: number;
}
