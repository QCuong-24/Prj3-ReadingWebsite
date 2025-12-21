package com.example.readingServer.repository;

import com.example.readingServer.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Use User_Id (or User_UserId depending on your User entity field name)
    List<Notification> findByUser_UserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    Optional<Notification> findByIdAndUser_UserId(Long id, Long userId);

    @Transactional
    @Modifying
    void deleteByUser_UserId(Long userId);
}

