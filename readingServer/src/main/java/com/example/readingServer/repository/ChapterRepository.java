package com.example.readingServer.repository;

import com.example.readingServer.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByNovel_NovelIdOrderByChapterNumberAsc(Long novelId);
}