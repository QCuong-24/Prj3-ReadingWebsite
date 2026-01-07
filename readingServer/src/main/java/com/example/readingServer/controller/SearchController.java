package com.example.readingServer.controller;

import com.example.readingServer.entity.ChapterSearchDocument;
import com.example.readingServer.entity.NovelSearchDocument;
import com.example.readingServer.service.ElasticService;
import com.example.readingServer.service.SearchService;
import com.example.readingServer.service.dto.SearchResultDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    /* ===== Advanced search and functions ===== */
    @GetMapping("/novels")
    public ResponseEntity<SearchResultDTO<NovelSearchDocument>> searchNovels(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) List<String> genres,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) throws IOException {

        return ResponseEntity.ok(searchService.searchNovels(q, genres, status, page, size));
    }

    @GetMapping("/chapters")
    public ResponseEntity<SearchResultDTO<ChapterSearchDocument>> searchChapters(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws IOException {

        return ResponseEntity.ok(searchService.searchChapters(q, page, size));
    }
}
