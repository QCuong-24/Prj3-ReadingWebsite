package com.example.readingServer.service;

import com.example.readingServer.entity.Bookmark;
import com.example.readingServer.entity.Chapter;
import com.example.readingServer.repository.BookmarkRepository;
import com.example.readingServer.repository.ChapterRepository;
import com.example.readingServer.repository.NovelRepository;
import com.example.readingServer.service.dto.ChapterDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final ChapterRepository chapterRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository, ChapterRepository chapterRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.chapterRepository = chapterRepository;
    }

    public void addBookmark(Long userId, Long chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        // Prevent duplicates
        if (bookmarkRepository.findByUserIdAndChapter_ChapterId(userId, chapterId).isPresent()) {
            return;
        }

        Bookmark bookmark = new Bookmark();
        bookmark.setUserId(userId);
        bookmark.setChapter(chapter);
        bookmark.setCreatedAt(LocalDate.now());

        bookmarkRepository.save(bookmark);
    }

    @Transactional
    public void removeBookmark(Long userId, Long chapterId) {
        bookmarkRepository.deleteByUserIdAndChapter_ChapterId(userId, chapterId);
    }

    public Boolean isBookmarked(Long userId, Long chapterId) {
        return bookmarkRepository
                .findByUserIdAndChapter_ChapterId(userId, chapterId)
                .isPresent();
    }

    public List<ChapterDTO> getBookmarks(Long userId) {
        return bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(b -> {
                    Chapter ch = b.getChapter();
                    return new ChapterDTO(
                            ch.getChapterId(),
                            ch.getNovel().getNovelId(),
                            ch.getTitle(),
                            ch.getChapterNumber(),
                            ch.getUpdatedAt()
                    );
                })
                .toList();
    }


}