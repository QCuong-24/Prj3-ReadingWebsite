package com.example.readingServer.service.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CommentDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String avatarUrl;
    private Long novelId;
    private Long chapterId;
    private Integer chapterNumber;
    private Long replyToId;
    private String content;
    private LocalDateTime createdAt;
}

