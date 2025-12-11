package com.example.readingServer.controller;

import com.example.readingServer.service.dto.ChapterDTO;
import com.example.readingServer.service.ChapterService;
import com.example.readingServer.service.dto.ChapterDetailDTO;
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
    public ResponseEntity<ChapterDetailDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(chapterService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ChapterDetailDTO> create(
            @RequestBody ChapterDetailDTO chapterDTO
    ) {
        ChapterDetailDTO created = chapterService.create(chapterDTO);
        return ResponseEntity.created(URI.create("/api/chapters/" + created.getId()))
                .body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChapterDetailDTO> update(
            @PathVariable Long id,
            @RequestBody ChapterDetailDTO chapterDetailDTO
    ) {
        ChapterDetailDTO updated = chapterService.update(id, chapterDetailDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        chapterService.delete(id);
        return ResponseEntity.noContent().build();
    }
}