package com.example.readingServer.repository;

import com.example.readingServer.entity.Novel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NovelRepository extends JpaRepository<Novel, Long> {
    @Modifying
    @Query("UPDATE Novel n SET n.views = n.views + 1 WHERE n.id = :id")
    void increaseViews(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Novel n SET n.followers = n.followers + 1 WHERE n.id = :id")
    void increaseFollowers(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Novel n SET n.followers = n.followers - 1 WHERE n.id = :id AND n.followers > 0")
    void decreaseFollowers(@Param("id") Long id);

    List<Novel> findTop10ByOrderByViewsDesc();
}