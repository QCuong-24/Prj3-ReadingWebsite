package com.example.readingServer.service;

import com.example.readingServer.entity.*;
import com.example.readingServer.repository.ChapterRepository;
import com.example.readingServer.repository.ReadingHistoryRepository;
import com.example.readingServer.service.dto.ChapterDTO;
import com.example.readingServer.service.dto.ReadingHistoryDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReadingHistoryService {
    private final ReadingHistoryRepository historyRepository;
    private final ChapterRepository chapterRepository;

    public ReadingHistoryService(ReadingHistoryRepository historyRepository, ChapterRepository chapterRepository) {
        this.historyRepository = historyRepository;
        this.chapterRepository = chapterRepository;
    }

    public ChapterDTO getLatestChapter(Long userId) {
        ReadingHistory history = historyRepository
                .findFirstByUserIdOrderByLastReadAtDesc(userId)
                .orElseThrow(() -> new RuntimeException("No reading history"));

        Chapter chapter = history.getChapter();

        return new ChapterDTO(
                chapter.getChapterId(),
                chapter.getNovel().getNovelId(),
                chapter.getTitle(),
                chapter.getChapterNumber(),
                chapter.getUpdatedAt()
        );
    }

    public void logReading(Long userId, Long chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        // Check if history exists
        ReadingHistory history = historyRepository
                .findByUserIdAndChapter_ChapterId(userId, chapterId)
                .orElse(new ReadingHistory());

        history.setUserId(userId);
        history.setChapter(chapter);
        history.setNovel(chapter.getNovel());
        history.setLastReadAt(LocalDate.now());

        historyRepository.save(history);
    }

    public List<ReadingHistoryDTO> getHistory(Long userId) {
        return historyRepository.findByUserIdOrderByLastReadAtDesc(userId)
                .stream()
                .map(h -> {
                    ReadingHistoryDTO dto = new ReadingHistoryDTO();
                    dto.setChapterId(h.getChapter().getChapterId());
                    dto.setNovelId(h.getNovel().getNovelId());
                    dto.setChapterTitle(h.getChapter().getTitle());
                    dto.setChapterNumber(h.getChapter().getChapterNumber());
                    dto.setLastReadAt(h.getLastReadAt());
                    return dto;
                })
                .toList();
    }


    @Transactional
    public void deleteHistory(Long userId, Long chapterId) {
        historyRepository.deleteByUserIdAndChapter_ChapterId(userId, chapterId);
    }

    @Transactional
    public void deleteAllHistory(Long userId) {
        historyRepository.deleteByUserId(userId);
    }


}
