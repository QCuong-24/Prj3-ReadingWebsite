package com.example.readingServer.repository;

import com.example.readingServer.entity.NovelFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NovelFollowRepository extends JpaRepository<NovelFollow, Long> {

    boolean existsByUser_UserIdAndNovel_NovelId(Long userId, Long novelId);

    Optional<NovelFollow> findByUser_UserIdAndNovel_NovelId(Long userId, Long novelId);

    List<NovelFollow> findByUser_UserId(Long userId);
}
