package com.example.readingServer.service;

import com.example.readingServer.entity.Chapter;
import com.example.readingServer.entity.ChapterSearchDocument;
import com.example.readingServer.entity.Novel;
import com.example.readingServer.entity.NovelSearchDocument;
import com.example.readingServer.repository.ChapterRepository;
import com.example.readingServer.repository.NovelRepository;
import com.example.readingServer.service.mapper.SearchMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SyncService {

    private final NovelRepository novelRepository;
    private final ChapterRepository chapterRepository;
    private final ElasticService elasticService;
    private final SearchMapper searchMapper;

    @Value("${app.elasticsearch.enabled:false}")
    private boolean elasticsearchEnabled;

    public Boolean isElasticsearchEnabled() {
        return elasticsearchEnabled;
    }

    public String toggleElasticsearch() {
        this.elasticsearchEnabled = !this.elasticsearchEnabled;
        return "Elasticsearch synchronization is now " + (this.elasticsearchEnabled ? "ENABLED" : "DISABLED");
    }

    @Transactional(readOnly = true)
    public void syncAllNovels() throws IOException {
        int pageSize = 100;
        int pageNumber = 0;
        Page<Novel> page;

        do {
            page = novelRepository.findAll(PageRequest.of(pageNumber, pageSize));
            List<NovelSearchDocument> docs = page.getContent().stream()
                    .map(searchMapper::toNovelDocument)
                    .collect(Collectors.toList());

            elasticService.bulkIndexNovels(docs);
            pageNumber++;
        } while (page.hasNext());
    }

    @Transactional(readOnly = true)
    public void syncAllChapters() throws IOException {
        int pageSize = 50; // Chapter content thường nặng, nên để size nhỏ hơn
        int pageNumber = 0;
        Page<Chapter> page;

        do {
            // Lưu ý: Cần thay chapterRepository.findAll trong SyncService thành findAllWithDetails
            page = chapterRepository.findAllWithDetails(PageRequest.of(pageNumber, pageSize));

            List<ChapterSearchDocument> docs = page.getContent().stream()
                    .map(searchMapper::toChapterDocument)
                    .collect(Collectors.toList());

            elasticService.bulkIndexChapters(docs);
            pageNumber++;
        } while (page.hasNext());
    }
}
