package com.example.readingServer.service;

import com.example.readingServer.entity.Chapter;
import com.example.readingServer.entity.Comment;
import com.example.readingServer.entity.Novel;
import com.example.readingServer.entity.User;
import com.example.readingServer.repository.ChapterRepository;
import com.example.readingServer.repository.CommentRepository;
import com.example.readingServer.repository.NovelRepository;
import com.example.readingServer.repository.UserRepository;
import com.example.readingServer.service.dto.CommentDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final NovelRepository novelRepository;
    private final ChapterRepository chapterRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // Create a new comment
    public CommentDTO createComment(CommentDTO dto) {
        Comment comment = new Comment();
        comment.setUserId(dto.getUserId());
        comment.setContent(dto.getContent());

        if (dto.getChapterId() != null) {
            Chapter chapter = chapterRepository.findById(dto.getChapterId())
                    .orElseThrow(() -> new RuntimeException("Chapter not found"));
            comment.setChapter(chapter);
            comment.setNovel(chapter.getNovel()); // novel lấy từ chapter
        } else if (dto.getNovelId() != null) {
            Novel novel = novelRepository.findById(dto.getNovelId())
                    .orElseThrow(() -> new RuntimeException("Novel not found"));
            comment.setNovel(novel);
        }

        if (dto.getReplyToId() != null) {
            Comment replyTo = commentRepository.findById(dto.getReplyToId())
                    .orElseThrow(() -> new RuntimeException("Reply target not found"));
            comment.setReplyTo(replyTo);

            // Notification khi reply
            notificationService.createNotification(
                    replyTo.getUserId(),
                    "COMMENT_REPLY",
                    "Có người trả lời bình luận của bạn",
                    dto.getContent(),
                    dto.getChapterId() != null
                            ? "/novels/" + comment.getNovel().getNovelId() + "/chapters/" + comment.getChapter().getChapterId()
                            : "/novels/" + comment.getNovel().getNovelId()
            );
        }

        Comment saved = commentRepository.save(comment);
        return mapToDTO(saved);
    }

    // Get all comments for a chapter
    public Page<CommentDTO> getCommentsByChapter(Long chapterId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        return commentRepository.findByChapter_ChapterIdOrderByCreatedAtAsc(chapterId, pageable)
                .map(this::mapToDTO);
    }

    public Page<CommentDTO> getCommentsByNovel(Long novelId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        return commentRepository.findByNovel_NovelId(novelId, pageable)
                .map(this::mapToDTO);
    }

    // Get replies for a comment
    public List<CommentDTO> getReplies(Long commentId) {
        return commentRepository.findByReplyTo_IdOrderByCreatedAtAsc(commentId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Delete a comment
    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        commentRepository.delete(comment);
    }

    // Mapper
    private CommentDTO mapToDTO(Comment comment) {
        User user = userRepository.findById(comment.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new CommentDTO(
                comment.getId(),
                comment.getUserId(),
                user.getUsername(),
                user.getAvatarUrl(),
                comment.getNovel().getNovelId(),
                comment.getChapter() != null ? comment.getChapter().getChapterId() : null,
                comment.getChapter() != null ? comment.getChapter().getChapterNumber() : null,
                comment.getReplyTo() != null ? comment.getReplyTo().getId() : null,
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}
