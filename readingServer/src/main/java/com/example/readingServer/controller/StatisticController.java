package com.example.readingServer.controller;

import com.example.readingServer.service.dto.StatisticDTO;
import com.example.readingServer.service.StatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticController {

    private final StatisticService statisticService;

    // ========================= VIEWS =========================

    // Tổng view theo ngày
    @GetMapping("/views/total/day")
    public Long totalViewsByDay(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return statisticService.totalViewsByDay(date);
    }

    // Tổng view theo tháng
    @GetMapping("/views/total/month")
    public Long totalViewsByMonth(@RequestParam int month, @RequestParam int year) {
        return statisticService.totalViewsByMonth(month, year);
    }

    // Tổng view theo năm
    @GetMapping("/views/total/year")
    public Long totalViewsByYear(@RequestParam int year) {
        return statisticService.totalViewsByYear(year);
    }

    // Top novel theo view trong ngày
    @GetMapping("/views/top/day")
    public List<StatisticDTO> topViewedByDay(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                             @RequestParam(defaultValue = "10") int limit) {
        return statisticService.topViewedByDay(date, limit);
    }

    // Top novel theo view trong tháng
    @GetMapping("/views/top/month")
    public List<StatisticDTO> topViewedByMonth(@RequestParam int month, @RequestParam int year,
                                               @RequestParam(defaultValue = "10") int limit) {
        return statisticService.topViewedByMonth(month, year, limit);
    }

    // Top novel theo view trong năm
    @GetMapping("/views/top/year")
    public List<StatisticDTO> topViewedByYear(@RequestParam int year,
                                              @RequestParam(defaultValue = "10") int limit) {
        return statisticService.topViewedByYear(year, limit);
    }

    // ========================= FOLLOWS =========================

    // Tổng follow theo ngày
    @GetMapping("/follows/total/day")
    public Long totalFollowsByDay(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return statisticService.totalFollowsByDay(date);
    }

    // Tổng follow theo tháng
    @GetMapping("/follows/total/month")
    public Long totalFollowsByMonth(@RequestParam int month, @RequestParam int year) {
        return statisticService.totalFollowsByMonth(month, year);
    }

    // Tổng follow theo năm
    @GetMapping("/follows/total/year")
    public Long totalFollowsByYear(@RequestParam int year) {
        return statisticService.totalFollowsByYear(year);
    }

    // Top novel theo follow trong ngày
    @GetMapping("/follows/top/day")
    public List<StatisticDTO> topFollowedByDay(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                               @RequestParam(defaultValue = "10") int limit) {
        return statisticService.topFollowedByDay(date, limit);
    }

    // Top novel theo follow trong tháng
    @GetMapping("/follows/top/month")
    public List<StatisticDTO> topFollowedByMonth(@RequestParam int month, @RequestParam int year,
                                                 @RequestParam(defaultValue = "10") int limit) {
        return statisticService.topFollowedByMonth(month, year, limit);
    }

    // Top novel theo follow trong năm
    @GetMapping("/follows/top/year")
    public List<StatisticDTO> topFollowedByYear(@RequestParam int year,
                                                @RequestParam(defaultValue = "10") int limit) {
        return statisticService.topFollowedByYear(year, limit);
    }
}