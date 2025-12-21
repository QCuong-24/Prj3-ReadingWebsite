package com.example.readingServer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(
        name = "novel_follows",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "novel_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NovelFollow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "novel_id", nullable = false)
    private Novel novel;

    private LocalDate followedAt = LocalDate.now();
}
