package com.example.readingServer.controller;

import com.example.readingServer.service.CommentService;
import com.example.readingServer.service.dto.CommentDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // Create comment
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public CommentDTO createComment(@RequestBody CommentDTO dto) {
        return commentService.createComment(dto);
    }

    // Get all comments for a chapter
    @GetMapping("/chapter/{chapterId}")
    public Page<CommentDTO> getCommentsByChapter(
            @PathVariable Long chapterId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return commentService.getCommentsByChapter(chapterId, page, size);
    }

    // Get all comments for a novel
    @GetMapping("/novel/{novelId}")
    public Page<CommentDTO> getCommentsByNovel(
            @PathVariable Long novelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return commentService.getCommentsByNovel(novelId, page, size);
    }

    // Get replies for a comment
    @GetMapping("/reply/{commentId}")
    public List<CommentDTO> getReplies(@PathVariable Long commentId) {
        return commentService.getReplies(commentId);
    }

    // Delete comment
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }
}