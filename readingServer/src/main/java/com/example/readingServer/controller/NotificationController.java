package com.example.readingServer.controller;

import com.example.readingServer.service.NotificationService;
import com.example.readingServer.service.dto.NotificationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // SSE subscription - SseEmitter is returned directly
    @GetMapping("/stream/{userId}")
    public SseEmitter streamNotifications(@PathVariable Long userId) {
        return notificationService.subscribe(userId);
    }

    // Create notification
    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO dto) {
        NotificationDTO created = notificationService.createNotification(
                dto.getUserId(),
                dto.getType(),
                dto.getTitle(),
                dto.getMessage(),
                dto.getTargetUrl()
        );
        return new ResponseEntity<>(created, HttpStatus.CREATED); // 201 Created
    }

    // Get all notifications
    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotifications(@PathVariable Long userId) {
        List<NotificationDTO> notifications = notificationService.getNotifications(userId);
        return ResponseEntity.ok(notifications); // 200 OK
    }

    // Get unread notifications
    @GetMapping("/{userId}/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(@PathVariable Long userId) {
        List<NotificationDTO> unread = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(unread); // 200 OK
    }

    // Mark notification as read
    @PutMapping("/{userId}/{id}/read")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable Long userId, @PathVariable Long id) {
        NotificationDTO updated = notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(updated); // 200 OK
    }

    // Delete single notification
    @DeleteMapping("/{userId}/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long userId, @PathVariable Long id) {
        notificationService.deleteNotification(id, userId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    // Delete all notifications
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteAllNotifications(@PathVariable Long userId) {
        notificationService.deleteAllNotifications(userId);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}