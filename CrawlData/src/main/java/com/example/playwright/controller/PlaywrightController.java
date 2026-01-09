package com.example.playwright.controller;

import com.example.playwright.entity.Novel;
import com.example.playwright.service.AddDatabaseService;
import com.example.playwright.service.PlaywrightRunner;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/playwright")
@RequiredArgsConstructor
public class PlaywrightController {
    private final PlaywrightRunner runner;
    private final AddDatabaseService dtbService;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }

    // GET kiểu đơn giản: truyền URL qua query
    @GetMapping("/fetch")
    public ResponseEntity<?> fetch(@RequestParam String url) {
        Map<String, Object> data = runner.fetchSingleChapter(url);
        if (data.containsKey("error")) {
            return ResponseEntity.status(500).body(data);
        }
        return ResponseEntity.ok(data);
    }

    // POST: nhận URL qua body JSON
    @PostMapping("/fetch")
    public ResponseEntity<?> fetchPost(@RequestBody Map<String, Object> body) {
        String url = (String) body.get("url");
        if (url == null || url.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing 'url'"));
        }
        Map<String, Object> data = runner.fetchSingleChapter(url);
        if (data.containsKey("error")) {
            return ResponseEntity.status(500).body(data);
        }
        return ResponseEntity.ok(data);
    }

    @PostMapping("/fetchAll")
    public ResponseEntity<?> fetchAll(@RequestBody Map<String, Object> body) {
        String url = (String) body.get("url");
        if (url == null || url.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing 'url'"));
        }
        List<Map<String, Object>> data = runner.fetchAllChapters(url);
        return ResponseEntity.ok(data);
    }

    @PostMapping("/crawl-auto")
    public ResponseEntity<?> crawlAuto(@RequestBody Map<String, String> body) {
        String id = body.get("novelId");
        if (id == null || id.isBlank()) {
            return ResponseEntity.badRequest().body("ID không được trống");
        }

        // Bước 1: Crawl thông tin tổng quan của truyện
        Novel novelInfo = runner.fetchNovel("https://novelbin.com/b/"+id);
        if (novelInfo == null) {
            return ResponseEntity.status(500).body("Không thể lấy thông tin truyện từ URL này.");
        }

        // Bước 2: Lưu Novel vào Database thông qua Service
        // Lưu ý: createNovel của bạn cần nhận vào đối tượng Novel hoặc các String tương ứng
        Novel savedNovel = dtbService.createNovel(novelInfo.getTitle(), novelInfo.getDescription(), novelInfo.getAuthor(), novelInfo.getPublicationDate());
        // (Bạn có thể cập nhật dbService.createNovel để nhận toàn bộ object Novel nếu muốn lưu cả Author/Image)

        // Bước 3: Chạy Async để crawl toàn bộ chương
        java.util.concurrent.CompletableFuture.runAsync(() -> {
            runner.fetchAllChaptersAndSave("https://novelbin.me/ajax/chapter-archive?novelId="+id, savedNovel);
        });

        return ResponseEntity.ok(Map.of(
                "message", "Đã nhận dạng truyện: " + savedNovel.getTitle(),
                "status", "Đang tiến hành crawl các chương ngầm..."
        ));
    }

}
