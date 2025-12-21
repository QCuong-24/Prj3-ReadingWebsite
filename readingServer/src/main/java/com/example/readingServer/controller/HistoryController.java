package com.example.readingServer.controller;

import com.example.readingServer.service.ChapterService;
import com.example.readingServer.service.ReadingHistoryService;
import com.example.readingServer.service.dto.ChapterDTO;
import com.example.readingServer.service.dto.ReadingHistoryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final ReadingHistoryService historyService;

    public HistoryController(ReadingHistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping("/{userId}/continue")
    public ResponseEntity<ChapterDTO> continueReading(@PathVariable Long userId) {
        ChapterDTO chapter = historyService.getLatestChapter(userId);
        return ResponseEntity.ok(chapter);
    }

    @PostMapping("/log")
    public ResponseEntity<Void> logReading(@RequestParam Long userId, @RequestParam Long chapterId) {
        historyService.logReading(userId, chapterId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ReadingHistoryDTO>> getHistory(@PathVariable Long userId) {
        List<ReadingHistoryDTO> history = historyService.getHistory(userId);
        return ResponseEntity.ok(history);
    }

    @Transactional
    @DeleteMapping("/{userId}/chapter/{chapterId}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long userId, @PathVariable Long chapterId) {
        historyService.deleteHistory(userId, chapterId);
        return ResponseEntity.noContent().build();
    }

    @Transactional
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteAllHistory(@PathVariable Long userId) {
        historyService.deleteAllHistory(userId);
        return ResponseEntity.noContent().build();
    }
}
