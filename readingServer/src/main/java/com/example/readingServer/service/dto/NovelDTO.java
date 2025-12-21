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
public class NovelDTO {

    private Long id;

    @NotBlank
    private String title;

    private String description;

    private String author;

    @NotNull
    private String status;

    private LocalDate publicationDate;

    private String coverImageUrl;

    private Long views;

    private Long followers;
}