package com.example.readingServer.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Document(indexName = "chapters")
@Getter
@Setter
@Builder
@NoArgsConstructor @AllArgsConstructor
public class ChapterSearchDocument {

    @Id
    private Long chapterId;

    @Field(type = FieldType.Text)
    private String chapterTitle;

    @Field(type = FieldType.Text)
    private String content;

    /* ===== DENORMALIZED NOVEL ===== */

    @Field(type = FieldType.Long)
    private Long novelId;

    @Field(type = FieldType.Text)
    private String novelTitle;

    @Field(type = FieldType.Keyword)
    private String novelStatus;

    @Field(type = FieldType.Keyword)
    private List<String> genres;
}

