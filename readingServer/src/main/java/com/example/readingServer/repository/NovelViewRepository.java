package com.example.readingServer.repository;

import com.example.readingServer.entity.NovelView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface NovelViewRepository extends JpaRepository<NovelView, Long> {

    // Đếm tổng view theo ngày
    @Query("SELECT COUNT(v) FROM NovelView v WHERE v.viewedAt = :date")
    Long countTotalViewsByDay(@Param("date") LocalDate date);

    // Đếm tổng view theo tháng
    @Query("SELECT COUNT(v) FROM NovelView v WHERE MONTH(v.viewedAt) = :month AND YEAR(v.viewedAt) = :year")
    Long countTotalViewsByMonth(@Param("month") int month, @Param("year") int year);

    // Đếm tổng view theo năm
    @Query("SELECT COUNT(v) FROM NovelView v WHERE YEAR(v.viewedAt) = :year")
    Long countTotalViewsByYear(@Param("year") int year);

    // Top novel theo ngày
    @Query("SELECT v.novel.id, COUNT(v) FROM NovelView v WHERE v.viewedAt = :date GROUP BY v.novel.id ORDER BY COUNT(v) DESC")
    List<Object[]> findTopViewedByDay(@Param("date") LocalDate date);

    // Top novel theo tháng
    @Query("SELECT v.novel.id, COUNT(v) FROM NovelView v WHERE MONTH(v.viewedAt) = :month AND YEAR(v.viewedAt) = :year GROUP BY v.novel.id ORDER BY COUNT(v) DESC")
    List<Object[]> findTopViewedByMonth(@Param("month") int month, @Param("year") int year);

    // Top novel theo năm
    @Query("SELECT v.novel.id, COUNT(v) FROM NovelView v WHERE YEAR(v.viewedAt) = :year GROUP BY v.novel.id ORDER BY COUNT(v) DESC")
    List<Object[]> findTopViewedByYear(@Param("year") int year);
}