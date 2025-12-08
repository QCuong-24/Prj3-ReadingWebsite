package com.example.readingServer.controller;

import com.example.readingServer.service.dto.NovelDTO;
import com.example.readingServer.service.NovelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/novels")
public class NovelController {

    private final NovelService novelService;

    public NovelController(NovelService novelService) {
        this.novelService = novelService;
    }

    @GetMapping
    public ResponseEntity<List<NovelDTO>> getAll() {
        return ResponseEntity.ok(novelService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NovelDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(novelService.findById(id));
    }

    @GetMapping("/page")
    public ResponseEntity<Page<NovelDTO>> getAllByPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(novelService.findAllByPage(page, size));
    }

    @PostMapping
    public ResponseEntity<NovelDTO> create(@RequestBody NovelDTO novel) {
        NovelDTO created = novelService.create(novel);
        return ResponseEntity.created(URI.create("/api/novels/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NovelDTO> update(@PathVariable Long id, @RequestBody NovelDTO novel) {
        NovelDTO updated = novelService.update(id, novel);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        novelService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

