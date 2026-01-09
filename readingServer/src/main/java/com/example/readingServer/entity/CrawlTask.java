package com.example.readingServer.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crawl_tasks")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrawlTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;          // URL của API bên ngoài
    private String method;       // GET, POST, ...

    private String progress;

    @Column(columnDefinition = "TEXT")
    private String requestBody;  // Lệnh điều khiển bạn đã gửi đi

    private Integer statusCode;  // Mã lỗi HTTP trả về (200, 404, 500...)

    @Column(columnDefinition = "TEXT")
    private String errorMessage; // Lưu lỗi nếu gọi API thất bại

    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}