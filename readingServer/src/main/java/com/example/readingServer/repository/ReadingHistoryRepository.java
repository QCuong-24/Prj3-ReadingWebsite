package com.example.readingServer.repository;

import com.example.readingServer.entity.ReadingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReadingHistoryRepository extends JpaRepository<ReadingHistory, Long> {

    Optional<ReadingHistory> findFirstByUserIdOrderByLastReadAtDesc(Long userId);

    List<ReadingHistory> findByUserIdOrderByLastReadAtDesc(Long userId);

    Optional<ReadingHistory> findByUserIdAndChapter_ChapterId(Long userId, Long chapterId);

    Optional<ReadingHistory> findByUserIdAndNovel_NovelId(Long userId, Long novelId);

    @Transactional
    void deleteByUserId(Long userId);

    @Transactional
    void deleteByUserIdAndChapter_ChapterId(Long userId, Long chapterId);

}