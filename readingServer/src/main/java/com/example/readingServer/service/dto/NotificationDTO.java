package com.example.readingServer.service.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter @NoArgsConstructor @AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private Long userId;       // or UserDTO if you have a User entity
    private String type;       // NEW_CHAPTER, COMMENT_REPLY, SYSTEM
    private String title;
    private String message;
    private String targetUrl;
    private Boolean isRead;
    private LocalDateTime createdAt;
}

