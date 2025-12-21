package com.example.readingServer.repository;

import com.example.readingServer.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    List<Bookmark> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Bookmark> findByUserIdAndChapter_ChapterId(Long userId, Long chapterId);

    @Transactional
    void deleteByUserIdAndChapter_ChapterId(Long userId, Long chapterId);
}
