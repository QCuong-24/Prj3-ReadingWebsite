package com.example.readingServer.service.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
public class ReadingHistoryDTO {
    private Long chapterId;
    private Long novelId;
    private String chapterTitle;
    private Integer chapterNumber;
    private LocalDate lastReadAt;
}
