package com.example.readingServer.service;

import com.example.readingServer.service.dto.StatisticDTO;
import com.example.readingServer.entity.Novel;
import com.example.readingServer.repository.NovelRepository;
import com.example.readingServer.repository.NovelViewRepository;
import com.example.readingServer.repository.NovelFollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticService {

    private final NovelRepository novelRepo;
    private final NovelViewRepository viewRepo;
    private final NovelFollowRepository followRepo;

    // Tổng view
    public Long totalViewsByDay(LocalDate date) {
        return viewRepo.countTotalViewsByDay(date);
    }
    public Long totalViewsByMonth(int month, int year) {
        return viewRepo.countTotalViewsByMonth(month, year);
    }
    public Long totalViewsByYear(int year) {
        return viewRepo.countTotalViewsByYear(year);
    }

    // Tổng follow
    public Long totalFollowsByDay(LocalDate date) {
        return followRepo.countTotalFollowsByDay(date);
    }
    public Long totalFollowsByMonth(int month, int year) {
        return followRepo.countTotalFollowsByMonth(month, year);
    }
    public Long totalFollowsByYear(int year) {
        return followRepo.countTotalFollowsByYear(year);
    }

    // Top view
    public List<StatisticDTO> topViewedByDay(LocalDate date, int limit) {
        return map(viewRepo.findTopViewedByDay(date), limit);
    }
    public List<StatisticDTO> topViewedByMonth(int month, int year, int limit) {
        return map(viewRepo.findTopViewedByMonth(month, year), limit);
    }
    public List<StatisticDTO> topViewedByYear(int year, int limit) {
        return map(viewRepo.findTopViewedByYear(year), limit);
    }

    // Top follow
    public List<StatisticDTO> topFollowedByDay(LocalDate date, int limit) {
        return map(followRepo.findTopFollowedByDay(date), limit);
    }
    public List<StatisticDTO> topFollowedByMonth(int month, int year, int limit) {
        return map(followRepo.findTopFollowedByMonth(month, year), limit);
    }
    public List<StatisticDTO> topFollowedByYear(int year, int limit) {
        return map(followRepo.findTopFollowedByYear(year), limit);
    }

    // Mapper từ Object[] sang DTO
    private List<StatisticDTO> map(List<Object[]> rows, int limit) {
        return rows.stream().limit(limit).map(r -> {
            Long novelId = (Long) r[0];
            Long count = (Long) r[1];
            String title = novelRepo.findById(novelId).map(Novel::getTitle).orElse("Unknown");
            return new StatisticDTO(novelId, title, count);
        }).toList();
    }
}