package com.example.readingServer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Entity @Builder @DynamicInsert
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Novel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long novelId;

    private String title;

    private LocalDate publicationDate;

    private String coverImageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String author;

    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToMany(mappedBy = "novel", cascade = CascadeType.ALL)
    private List<Chapter> chapters;

    @ManyToMany
    @JoinTable(
            name = "novel_genre",
            joinColumns = @JoinColumn(name = "novel_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User postUser;

    public enum Status {
        Ongoing,
        Finished,
    }

    @Builder.Default
    @Column(nullable = false)
    private Long views = 0L;

    @Builder.Default
    @Column(nullable = false)
    private Long followers = 0L;

    @OneToMany(mappedBy = "novel", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<NovelFollow> novelFollows = new HashSet<>();
}