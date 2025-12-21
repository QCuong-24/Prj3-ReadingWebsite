package com.example.readingServer.controller;

import com.example.readingServer.service.BookmarkService;
import com.example.readingServer.service.dto.ChapterDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @PostMapping("/{userId}/{chapterId}")
    public ResponseEntity<Void> addBookmark(@PathVariable Long userId, @PathVariable Long chapterId) {
        bookmarkService.addBookmark(userId, chapterId);
        return ResponseEntity.ok().build();
    }

    @Transactional
    @DeleteMapping("/{userId}/{chapterId}")
    public ResponseEntity<Void> removeBookmark(@PathVariable Long userId, @PathVariable Long chapterId) {
        bookmarkService.removeBookmark(userId, chapterId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/{chapterId}/isBookmarked")
    public ResponseEntity<Boolean> isBookmarked(@PathVariable Long userId, @PathVariable Long chapterId) {
        return ResponseEntity.ok(bookmarkService.isBookmarked(userId, chapterId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ChapterDTO>> getBookmarks(@PathVariable Long userId) {
        List<ChapterDTO> bookmarks = bookmarkService.getBookmarks(userId);
        return ResponseEntity.ok(bookmarks);
    }


}