package com.example.readingServer.service;

import com.example.readingServer.entity.Notification;
import com.example.readingServer.entity.User;
import com.example.readingServer.exception.ResourceNotFoundException;
import com.example.readingServer.repository.NotificationRepository;
import com.example.readingServer.repository.UserRepository;
import com.example.readingServer.service.dto.NotificationDTO;
import lombok.*;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // Active SSE connections
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    // Subscribe user to SSE stream
    public SseEmitter subscribe(Long userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.put(userId, emitter);

        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));

        return emitter;
    }

    // Create and send notification
    public NotificationDTO createNotification(Long userId, String type, String title, String message, String targetUrl) {
        Notification notification = new Notification();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setTargetUrl(targetUrl);
        //notification.setIsRead(false);
        //notification.setCreatedAt(LocalDateTime.now());

        Notification saved = notificationRepository.save(notification);

        // Push via SSE if user is connected
        sendSseNotification(userId, saved);

        return mapToDTO(saved);
    }

    // Mark a notification as read
    public NotificationDTO markAsRead(Long id, Long userId) {
        Notification notification = notificationRepository.findByIdAndUser_UserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);
        Notification updated = notificationRepository.save(notification);

        sendSseReadEvent(userId, updated); // push read event

        return mapToDTO(updated);
    }

    // Push notification via SSE
    private void sendSseNotification(Long userId, Notification notification) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("notification")
                        .data(mapToDTO(notification)));
            } catch (IOException e) {
                emitters.remove(userId);
            }
        }
    }

    // Push read event
    private void sendSseReadEvent(Long userId, Notification notification) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("read")
                        .data(mapToDTO(notification)));
            } catch (IOException e) {
                emitters.remove(userId);
            }
        }
    }

    // Get all notifications for a user
    public List<NotificationDTO> getNotifications(Long userId) {
        return notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Get unread notifications
    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Delete a single notification
    public void deleteNotification(Long id, Long userId) {
        Notification notification = notificationRepository.findByIdAndUser_UserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notificationRepository.delete(notification);
    }

    // Delete all notifications for a user
    public void deleteAllNotifications(Long userId) {
        notificationRepository.deleteByUser_UserId(userId);
    }

    private NotificationDTO mapToDTO(Notification notification) {
        return new NotificationDTO(
                notification.getId(),
                notification.getUser().getUserId(),
                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getTargetUrl(),
                notification.getIsRead(),
                notification.getCreatedAt()
        );
    }
}
