package com.example.readingServer.service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChapterDTO {
    private Long id;

    @NotNull
    private Long novelId;

    @NotBlank
    private String title;

    @NotNull
    private Integer chapterNumber;

    private String content;

    private LocalDate updatedAt;
}