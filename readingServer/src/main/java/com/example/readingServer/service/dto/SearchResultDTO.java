package com.example.readingServer.service.dto;

import lombok.*;

import java.util.List;

@Getter @Setter
@Builder
@AllArgsConstructor @NoArgsConstructor
public class SearchResultDTO<T> {

    private List<T> items;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private long executionTime;
}

