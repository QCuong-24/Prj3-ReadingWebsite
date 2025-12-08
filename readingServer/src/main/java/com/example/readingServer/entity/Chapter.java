package com.example.readingServer.entity;

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

    private Integer chapterNumber;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDate updatedAt;
}