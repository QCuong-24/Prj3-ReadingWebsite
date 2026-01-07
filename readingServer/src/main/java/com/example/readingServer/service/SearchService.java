package com.example.readingServer.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.example.readingServer.entity.ChapterSearchDocument;
import com.example.readingServer.entity.NovelSearchDocument;
import com.example.readingServer.service.dto.SearchResultDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {

    private final ElasticsearchClient client;

    /**
     * TÌM KIẾM TRUYỆN (NOVEL)
     * Kết hợp tìm kiếm theo từ khóa và lọc theo thể loại, trạng thái
     */
    public SearchResultDTO<NovelSearchDocument> searchNovels(
            String keyword,
            List<String> genres,
            String status,
            int page,
            int size) throws IOException {

        long startTime = System.currentTimeMillis();

        SearchResponse<NovelSearchDocument> response = client.search(s -> s
                        .index("novels")
                        .from(page * size)
                        .size(size)
                        .query(q -> q.bool(b -> {
                            // 1. Tìm kiếm mờ theo từ khóa (Title, Author, Description)
                            if (keyword != null && !keyword.isBlank()) {
                                b.must(m -> m.multiMatch(mm -> mm
                                        .fields("title^3", "author^2", "description") // Trọng số title cao nhất
                                        .query(keyword)
                                        .fuzziness("AUTO")));
                            }

                            // 2. Lọc theo danh sách thể loại (Match ALL genres)
                            if (genres != null && !genres.isEmpty()) {
                                for (String genre : genres) {
                                    b.filter(f -> f.term(t -> t.field("genres").value(genre)));
                                }
                            }

                            // 3. Lọc theo trạng thái
                            if (status != null && !status.isBlank()) {
                                b.filter(f -> f.term(t -> t.field("status").value(status)));
                            }

                            return b;
                        }))
                        .sort(so -> so.field(f -> f.field("views").order(SortOrder.Desc))), // Ưu tiên truyện hot
                NovelSearchDocument.class
        );

        return buildSearchResultDTO(response, page, size, startTime);
    }

    /**
     * TÌM KIẾM CHƯƠNG (CHAPTER)
     * Tìm trong nội dung và trả về đoạn trích dẫn có highlight
     */
    public SearchResultDTO<ChapterSearchDocument> searchChapters(
            String keyword,
            int page,
            int size) throws IOException {

        long startTime = System.currentTimeMillis();

        SearchResponse<ChapterSearchDocument> response = client.search(s -> s
                        .index("chapters")
                        .from(page * size)
                        .size(size)
                        .query(q -> q.match(m -> m
                                .field("content")
                                .query(keyword)
                                .fuzziness("AUTO")
                        ))
                        .highlight(h -> h
                                .fields("content", f -> f
                                        .preTags("<mark>").postTags("</mark>")
                                        .fragmentSize(150) // Trả về 150 ký tự quanh từ khóa
                                        .numberOfFragments(1)
                                )
                        ),
                ChapterSearchDocument.class
        );

        // Map kết quả và xử lý Highlight
        List<ChapterSearchDocument> items = response.hits().hits().stream().map(hit -> {
            ChapterSearchDocument doc = hit.source();
            if (hit.highlight().containsKey("content")) {
                // Thay nội dung gốc bằng đoạn trích dẫn đã highlight
                doc.setContent(hit.highlight().get("content").get(0));
            }
            return doc;
        }).toList();

        long total = response.hits().total().value();

        return SearchResultDTO.<ChapterSearchDocument>builder()
                .items(items)
                .totalElements(total)
                .totalPages((int) Math.ceil((double) total / size))
                .currentPage(page)
                .executionTime(System.currentTimeMillis() - startTime)
                .build();
    }

    /**
     * Helper: Build SearchResultDTO cho Novel
     */
    private SearchResultDTO<NovelSearchDocument> buildSearchResultDTO(
            SearchResponse<NovelSearchDocument> response, int page, int size, long startTime) {

        List<NovelSearchDocument> items = response.hits().hits().stream()
                .map(Hit::source)
                .toList();

        long total = response.hits().total().value();

        return SearchResultDTO.<NovelSearchDocument>builder()
                .items(items)
                .totalElements(total)
                .totalPages((int) Math.ceil((double) total / size))
                .currentPage(page)
                .executionTime(System.currentTimeMillis() - startTime)
                .build();
    }
}