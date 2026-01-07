package com.example.readingServer.controller;

import com.example.readingServer.entity.ChapterSearchDocument;
import com.example.readingServer.entity.NovelSearchDocument;
import com.example.readingServer.service.ElasticService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/elastic")
public class ElasticController {
    private final ElasticService elasticService;

    /* ===== NOVELS ===== */

    @PostMapping("/novel")
    public NovelSearchDocument addNovel(@RequestBody NovelSearchDocument novel) throws IOException {
        return elasticService.indexNovel(novel);
    }

    @GetMapping("/novel/{id}")
    public NovelSearchDocument getNovel(@PathVariable Long id) throws IOException {
        return elasticService.getNovel(id);
    }

    @GetMapping("/novel/author/{author}")
    public List<NovelSearchDocument> getNovelsByAuthor(@PathVariable String author) throws IOException {
        return elasticService.searchNovelsByAuthor(author);
    }

    @PutMapping("/novel/{id}")
    public NovelSearchDocument updateNovel(@PathVariable Long id, @RequestBody NovelSearchDocument novel) throws IOException {
        return elasticService.updateNovel(id, novel);
    }

    @DeleteMapping("/novel/{id}")
    public void deleteNovel(@PathVariable Long id) throws IOException {
        elasticService.deleteNovel(id);
    }

    /* ===== CHAPTERS ===== */

    @PostMapping("/chapter")
    public ChapterSearchDocument addChapter(@RequestBody ChapterSearchDocument chapter) throws IOException {
        return elasticService.indexChapter(chapter);
    }

    @GetMapping("/chapter/{id}")
    public ChapterSearchDocument getChapter(@PathVariable Long id) throws IOException {
        return elasticService.getChapter(id);
    }

    @GetMapping("/chapter/title/{title}")
    public List<ChapterSearchDocument> getChaptersByTitle(@PathVariable String title) throws IOException {
        return elasticService.searchChaptersByTitle(title);
    }

    @PutMapping("/chapter/{id}")
    public ChapterSearchDocument updateChapter(@PathVariable Long id, @RequestBody ChapterSearchDocument chapter) throws IOException {
        return elasticService.updateChapter(id, chapter);
    }

    @DeleteMapping("/chapter/{id}")
    public void deleteChapter(@PathVariable Long id) throws IOException {
        elasticService.deleteChapter(id);
    }
}
