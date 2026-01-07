package com.example.readingServer.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.*;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.example.readingServer.entity.ChapterSearchDocument;
import com.example.readingServer.entity.NovelSearchDocument;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ElasticService {

    private final ElasticsearchClient client;

    /* ===== CHAPTERS ===== */

    @Async
    public ChapterSearchDocument indexChapter(ChapterSearchDocument chapter) throws IOException {
        client.index(i -> i
                .index("chapters")
                .id(chapter.getChapterId().toString())
                .document(chapter)
        );
        return chapter;
    }

    public ChapterSearchDocument getChapter(Long id) throws IOException {
        GetResponse<ChapterSearchDocument> response = client.get(g -> g
                        .index("chapters")
                        .id(id.toString()),
                ChapterSearchDocument.class
        );
        return response.source();
    }

    public List<ChapterSearchDocument> searchChaptersByTitle(String title) throws IOException {
        SearchResponse<ChapterSearchDocument> response = client.search(s -> s
                        .index("chapters")
                        .query(q -> q.match(m -> m.field("chapterTitle").query(title))),
                ChapterSearchDocument.class
        );

        return response.hits().hits().stream()
                .map(Hit::source)
                .collect(Collectors.toList());
    }

    @Async
    public void deleteChapter(Long id) throws IOException {
        client.delete(d -> d.index("chapters").id(id.toString()));
    }

    @Async
    public ChapterSearchDocument updateChapter(Long id, ChapterSearchDocument updated) throws IOException {
        client.update(u -> u
                        .index("chapters")
                        .id(id.toString())
                        .doc(updated),
                ChapterSearchDocument.class
        );
        return updated;
    }

    /* ===== NOVELS ===== */

    @Async
    public NovelSearchDocument indexNovel(NovelSearchDocument novel) throws IOException {
        client.index(i -> i
                .index("novels")
                .id(novel.getNovelId().toString())
                .document(novel)
        );
        return novel;
    }

    public NovelSearchDocument getNovel(Long id) throws IOException {
        GetResponse<NovelSearchDocument> response = client.get(g -> g
                        .index("novels")
                        .id(id.toString()),
                NovelSearchDocument.class
        );
        return response.source();
    }

    public List<NovelSearchDocument> searchNovelsByAuthor(String author) throws IOException {
        SearchResponse<NovelSearchDocument> response = client.search(s -> s
                        .index("novels")
                        .query(q -> q.match(m -> m.field("author").query(author))),
                NovelSearchDocument.class
        );

        return response.hits().hits().stream()
                .map(Hit::source)
                .collect(Collectors.toList());
    }

    @Async
    public void deleteNovel(Long id) throws IOException {
        client.delete(d -> d.index("novels").id(id.toString()));
    }

    @Async
    public NovelSearchDocument updateNovel(Long id, NovelSearchDocument updated) throws IOException {
        client.update(u -> u
                        .index("novels")
                        .id(id.toString())
                        .doc(updated),
                NovelSearchDocument.class
        );
        return updated;
    }

    /* ===== BULK OPERATIONS ===== */

    public void bulkIndexNovels(List<NovelSearchDocument> novels) throws IOException {
        if (novels.isEmpty()) return;

        BulkRequest.Builder br = new BulkRequest.Builder();

        for (NovelSearchDocument novel : novels) {
            br.operations(op -> op
                    .index(idx -> idx
                            .index("novels")
                            .id(novel.getNovelId().toString())
                            .document(novel)
                    )
            );
        }

        BulkResponse result = client.bulk(br.build());

        if (result.errors()) {
            // Log lỗi nếu có bản ghi nào thất bại
            result.items().forEach(item -> {
                if (item.error() != null) {
                    System.err.println("Error indexing ID " + item.id() + ": " + item.error().reason());
                }
            });
        }
    }

    public void bulkIndexChapters(List<ChapterSearchDocument> chapters) throws IOException {
        if (chapters.isEmpty()) return;

        BulkRequest.Builder br = new BulkRequest.Builder();

        for (ChapterSearchDocument chapter : chapters) {
            br.operations(op -> op
                    .index(idx -> idx
                            .index("chapters")
                            .id(chapter.getChapterId().toString())
                            .document(chapter)
                    )
            );
        }
        client.bulk(br.build());
    }
}
