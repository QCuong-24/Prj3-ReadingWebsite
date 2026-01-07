package com.example.readingServer.service;

import com.example.readingServer.entity.ChapterContent;
import com.example.readingServer.service.dto.ChapterDTO;
import com.example.readingServer.entity.Chapter;
import com.example.readingServer.entity.Novel;
import com.example.readingServer.exception.ResourceNotFoundException;
import com.example.readingServer.repository.ChapterRepository;
import com.example.readingServer.repository.NovelRepository;
import com.example.readingServer.service.dto.ChapterDetailDTO;
import com.example.readingServer.service.mapper.SearchMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final NovelRepository novelRepository;

    private final ElasticService elasticService;
    private final SearchMapper searchMapper;

    @Value("${app.elasticsearch.enabled:false}")
    private boolean isElasticEnabled;

    // DTO MAPPERS

    private ChapterDTO mapToDTO(Chapter chapter) {
        return new ChapterDTO(
                chapter.getChapterId(),
                chapter.getNovel().getNovelId(),
                chapter.getTitle(),
                chapter.getChapterNumber(),
                chapter.getUpdatedAt()
        );
    }

    private ChapterDetailDTO mapToDetailDTO(Chapter chapter) {
        return new ChapterDetailDTO(
                chapter.getChapterId(),
                chapter.getNovel().getNovelId(),
                chapter.getTitle(),
                chapter.getChapterNumber(),
                chapter.getContent().getContent(),
                chapter.getUpdatedAt()
        );
    }

    private Chapter mapToEntity(ChapterDTO dto) {
        Chapter chapter = new Chapter();
        //chapter.setNovelId(dto.getNovelId);
        chapter.setTitle(dto.getTitle());
        chapter.setChapterNumber(dto.getChapterNumber());
        chapter.setUpdatedAt(dto.getUpdatedAt());
        return chapter;
    }

    private Chapter mapToEntity(ChapterDetailDTO dto) {
        Chapter chapter = new Chapter();
        //chapter.setNovelId(dto.getNovelId);
        chapter.setTitle(dto.getTitle());
        chapter.setChapterNumber(dto.getChapterNumber());
        chapter.setUpdatedAt(dto.getUpdatedAt());

        ChapterContent content = new ChapterContent();
        content.setContent(dto.getContent());
        chapter.setContent(content);
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

    public ChapterDetailDTO findById(Long id) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", id));
        return mapToDetailDTO(chapter);
    }

    public ChapterDetailDTO create(ChapterDetailDTO dto) {
        Novel novel = novelRepository.findById(dto.getNovelId())
                .orElseThrow(() -> new ResourceNotFoundException("Novel", "id", dto.getNovelId()));

        Chapter chapter = mapToEntity(dto);
        chapter.setNovel(novel);
        chapter.setUpdatedAt(LocalDate.now());

        Chapter saved = chapterRepository.save(chapter);
        if (isElasticEnabled) {
            try {
                // Cần đảm bảo Chapter có đầy đủ Novel info để map
                elasticService.indexChapter(searchMapper.toChapterDocument(saved));
            } catch (Exception e) {
                System.err.println("Elasticsearch Chapter Sync Error: " + e.getMessage());
            }
        }
        return mapToDetailDTO(saved);
    }

    public ChapterDetailDTO update(Long chapterId, ChapterDetailDTO dto) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", chapterId));

        chapter.setTitle(dto.getTitle());
        chapter.setChapterNumber(dto.getChapterNumber());

        chapter.setContent(dto.getContent());
        //chapter.setUpdatedAt(LocalDate.now());

        // If move chapter to another novel
        /*
        if (dto.getNovelId() != null && !dto.getNovelId().equals(chapter.getNovel().getNovelId())) {
            Novel newNovel = novelRepository.findById(dto.getNovelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Novel", "id", dto.getNovelId()));
            chapter.setNovel(newNovel);
        }*/

        Chapter updated = chapterRepository.save(chapter);
        if (isElasticEnabled) {
            try {
                // Cần đảm bảo Chapter có đầy đủ Novel info để map
                elasticService.indexChapter(searchMapper.toChapterDocument(updated));
            } catch (Exception e) {
                System.err.println("Elasticsearch Chapter Sync Error: " + e.getMessage());
            }
        }
        return mapToDetailDTO(updated);
    }

    public void delete(Long id) {
        Chapter chapter = chapterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter", "id", id));
        chapterRepository.delete(chapter);
        if (isElasticEnabled) {
            try {
                elasticService.deleteChapter(id);
            } catch (Exception e) {
                System.err.println("Elasticsearch Chapter Delete Error: " + e.getMessage());
            }
        }
    }
}