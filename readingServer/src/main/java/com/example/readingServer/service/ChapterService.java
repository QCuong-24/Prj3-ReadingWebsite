package com.example.readingServer.service;

import com.example.readingServer.service.dto.ChapterDTO;
import com.example.readingServer.entity.Chapter;
import com.example.readingServer.entity.Novel;
import com.example.readingServer.exception.ResourceNotFoundException;
import com.example.readingServer.repository.ChapterRepository;
import com.example.readingServer.repository.NovelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final NovelRepository novelRepository;

    public ChapterService(ChapterRepository chapterRepository, NovelRepository novelRepository) {
        this.chapterRepository = chapterRepository;
        this.novelRepository = novelRepository;
    }

    // DTO MAPPERS

    private ChapterDTO mapToDTO(Chapter chapter) {
        return new ChapterDTO(
                chapter.getChapterId(),
                chapter.getNovel().getNovelId(),
                chapter.getTitle(),
                chapter.getChapterNumber(),
                chapter.getContent(),
                chapter.getUpdatedAt()
        );
    }

    private Chapter mapToEntity(ChapterDTO dto) {
        Chapter chapter = new Chapter();
        chapter.setChapterId(dto.getId());
        chapter.setTitle(dto.getTitle());
        chapter.setChapterNumber(dto.getChapterNumber());
        chapter.setContent(dto.getContent());
        chapter.setUpdatedAt(dto.getUpdatedAt());
        return chapter;
    }

    // CRUD METHODS

    public List<ChapterDTO> findAll() {
        return chapterRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<ChapterDTO> findByNovelId(Long novelId) {
        return chapterRepository.findByNovel_NovelIdOrderByChapterNumberAsc(novelId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public ChapterDTO findById(Long id) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", id));
        return mapToDTO(chapter);
    }

    public ChapterDTO create(Long novelId, ChapterDTO dto) {
        Novel novel = novelRepository.findById(novelId)
                .orElseThrow(() -> new ResourceNotFoundException("Novel", "id", novelId));

        Chapter chapter = mapToEntity(dto);
        chapter.setNovel(novel);

        Chapter saved = chapterRepository.save(chapter);
        return mapToDTO(saved);
    }

    public ChapterDTO update(Long chapterId, ChapterDTO dto) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", chapterId));

        chapter.setTitle(dto.getTitle());
        chapter.setChapterNumber(dto.getChapterNumber());

        // If user wants to move chapter to another novel
        if (dto.getNovelId() != null && !dto.getNovelId().equals(chapter.getNovel().getNovelId())) {
            Novel newNovel = novelRepository.findById(dto.getNovelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Novel", "id", dto.getNovelId()));
            chapter.setNovel(newNovel);
        }

        Chapter updated = chapterRepository.save(chapter);
        return mapToDTO(updated);
    }

    public void delete(Long id) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", id));
        chapterRepository.delete(chapter);
    }
}