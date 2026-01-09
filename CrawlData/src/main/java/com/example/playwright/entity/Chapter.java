package com.example.playwright.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Chapter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chapterId;

    @ManyToOne
    @JoinColumn(name = "novel_id")
    private Novel novel;

    private String title;

    private LocalDate updatedAt;

    private Integer chapterNumber;

    @OneToOne(mappedBy = "chapter", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
    private ChapterContent content;

    public void setContent(ChapterContent content) {
        this.content = content;
        content.setChapter(this);
    }

    public void setContent(String content) {
        this.content.setContent(content);
    }
}