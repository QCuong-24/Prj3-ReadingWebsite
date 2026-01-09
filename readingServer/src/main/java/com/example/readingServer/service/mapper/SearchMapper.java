package com.example.readingServer.service.mapper;


import com.example.readingServer.entity.*;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class SearchMapper {

    public NovelSearchDocument toNovelDocument(Novel novel) {
        return NovelSearchDocument.builder()
                .novelId(novel.getNovelId())
                .title(novel.getTitle())
                .description(novel.getDescription())
                .author(novel.getAuthor())
                .status(novel.getStatus().name())
                .views(novel.getViews())
                .followers(novel.getFollowers())
                .genres(novel.getGenres().stream()
                        .map(Genre::getName) // Giả định Genre có trường name
                        .collect(Collectors.toList()))
                .build();
    }

    public ChapterSearchDocument toChapterDocument(Chapter chapter) {
        return ChapterSearchDocument.builder()
                .chapterId(chapter.getChapterId())
                .chapterTitle(chapter.getTitle())
                .chapterNumber(chapter.getChapterNumber())
                .content(chapter.getContent() != null ? chapter.getContent().getContent() : "")
                .novelId(chapter.getNovel().getNovelId())
                .novelTitle(chapter.getNovel().getTitle())
                .novelStatus(chapter.getNovel().getStatus().name())
                .genres(chapter.getNovel().getGenres().stream()
                        .map(Genre::getName)
                        .collect(Collectors.toList()))
                .build();
    }
}