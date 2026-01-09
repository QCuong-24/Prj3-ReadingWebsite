package com.example.readingServer.controller;

import com.example.readingServer.security.util.SecurityUtils;
import com.example.readingServer.service.dto.NovelDTO;
import com.example.readingServer.service.NovelService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/novels")
public class NovelController {

    private final NovelService novelService;
    private final SecurityUtils securityUtils;

    public NovelController(NovelService novelService, SecurityUtils securityUtils) {
        this.novelService = novelService;
        this.securityUtils = securityUtils;
    }

    // CRUD
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
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN')")
    public ResponseEntity<NovelDTO> create(@RequestBody NovelDTO novel) {
        NovelDTO created = novelService.create(novel);
        return ResponseEntity.created(URI.create("/api/novels/" + created.getId())).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN')")
    public ResponseEntity<NovelDTO> update(@PathVariable Long id, @RequestBody NovelDTO novel) {
        NovelDTO updated = novelService.update(id, novel);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('MANAGER','ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        novelService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Follow
    @PostMapping("/{novelId}/follow")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> follow(@PathVariable Long novelId) {
        novelService.followNovel(securityUtils.getCurrentUserId(), novelId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{novelId}/unfollow")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> unfollow(@PathVariable Long novelId) {
        novelService.unfollowNovel(securityUtils.getCurrentUserId(), novelId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{novelId}/isFollowed")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isFollowed(@PathVariable Long novelId) {
        return ResponseEntity.ok(novelService.isFollowedByUser(novelId, securityUtils.getCurrentUserId()));
    }

    @GetMapping("/followed")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NovelDTO>> getFollowedNovels() {
        return ResponseEntity.ok(
                novelService.getFollowedNovels(securityUtils.getCurrentUserId())
        );
    }

    // View
    @PostMapping("/{novelId}/view")
    public ResponseEntity<Void> view(@PathVariable Long novelId) {
        novelService.increaseView(novelId);
        return ResponseEntity.ok().build();
    }
}

