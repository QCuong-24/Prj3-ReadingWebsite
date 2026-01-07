package com.example.readingServer.repository;

import com.example.readingServer.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByNovel_NovelIdOrderByChapterNumberAsc(Long novelId);

    @Query("SELECT c FROM Chapter c JOIN FETCH c.novel JOIN FETCH c.content")
    Page<Chapter> findAllWithDetails(Pageable pageable);
}