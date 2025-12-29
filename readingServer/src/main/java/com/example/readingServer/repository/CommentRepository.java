package com.example.readingServer.repository;

import com.example.readingServer.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Get all comments for a chapter
    Page<Comment> findByChapter_ChapterIdOrderByCreatedAtAsc(Long chapterId, Pageable pageable);

    // Get all comments for a novel
    Page<Comment> findByNovel_NovelId(Long novelId, Pageable pageable);

    // Get replies for a comment
    List<Comment> findByReplyTo_IdOrderByCreatedAtAsc(Long replyToId);
}