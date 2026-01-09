package com.example.readingServer.repository;

import com.example.readingServer.entity.NovelFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface NovelFollowRepository extends JpaRepository<NovelFollow, Long> {

    boolean existsByUser_UserIdAndNovel_NovelId(Long userId, Long novelId);

    Optional<NovelFollow> findByUser_UserIdAndNovel_NovelId(Long userId, Long novelId);

    List<NovelFollow> findByUser_UserId(Long userId);

    // Đếm tổng follow theo ngày
    @Query("SELECT COUNT(f) FROM NovelFollow f WHERE f.followedAt = :date")
    Long countTotalFollowsByDay(@Param("date") LocalDate date);

    // Đếm tổng follow theo tháng
    @Query("SELECT COUNT(f) FROM NovelFollow f WHERE MONTH(f.followedAt) = :month AND YEAR(f.followedAt) = :year")
    Long countTotalFollowsByMonth(@Param("month") int month, @Param("year") int year);

    // Đếm tổng follow theo năm
    @Query("SELECT COUNT(f) FROM NovelFollow f WHERE YEAR(f.followedAt) = :year")
    Long countTotalFollowsByYear(@Param("year") int year);

    // Top novel theo ngày
    @Query("SELECT f.novel.id, COUNT(f) FROM NovelFollow f WHERE f.followedAt = :date GROUP BY f.novel.id ORDER BY COUNT(f) DESC")
    List<Object[]> findTopFollowedByDay(@Param("date") LocalDate date);

    // Top novel theo tháng
    @Query("SELECT f.novel.id, COUNT(f) FROM NovelFollow f WHERE MONTH(f.followedAt) = :month AND YEAR(f.followedAt) = :year GROUP BY f.novel.id ORDER BY COUNT(f) DESC")
    List<Object[]> findTopFollowedByMonth(@Param("month") int month, @Param("year") int year);

    // Top novel theo năm
    @Query("SELECT f.novel.id, COUNT(f) FROM NovelFollow f WHERE YEAR(f.followedAt) = :year GROUP BY f.novel.id ORDER BY COUNT(f) DESC")
    List<Object[]> findTopFollowedByYear(@Param("year") int year);

}
