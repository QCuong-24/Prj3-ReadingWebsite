package com.example.readingServer.controller;

import com.example.readingServer.service.dto.ChapterDTO;
import com.example.readingServer.service.ChapterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/chapters")
public class ChapterController {

    private final ChapterService chapterService;

    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    @GetMapping
    public ResponseEntity<List<ChapterDTO>> getAll() {
        return ResponseEntity.ok(chapterService.findAll());
    }

    @GetMapping(params = "novelId")
    public ResponseEntity<List<ChapterDTO>> getByNovel(@RequestParam Long novelId) {
        return ResponseEntity.ok(chapterService.findByNovelId(novelId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChapterDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(chapterService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ChapterDTO> create(
            @RequestParam Long novelId,
            @RequestBody ChapterDTO chapterDTO
    ) {
        ChapterDTO created = chapterService.create(novelId, chapterDTO);
        return ResponseEntity.created(URI.create("/api/chapters/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChapterDTO> update(
            @PathVariable Long chapterId,
            @RequestBody ChapterDTO chapterDTO
    ) {
        ChapterDTO updated = chapterService.update(chapterId, chapterDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        chapterService.delete(id);
        return ResponseEntity.noContent().build();
    }
}