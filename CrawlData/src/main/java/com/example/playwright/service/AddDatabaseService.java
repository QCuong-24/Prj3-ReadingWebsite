package com.example.playwright.service;

import com.example.playwright.entity.Chapter;
import com.example.playwright.entity.ChapterContent;
import com.example.playwright.entity.Novel;
import com.example.playwright.repository.ChapterRepository;
import com.example.playwright.repository.NovelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional
@RequiredArgsConstructor
public class AddDatabaseService {

    private final NovelRepository novelRepository;
    private final ChapterRepository chapterRepository;

    @Transactional
    public Novel createNovel(String title, String description, String author, LocalDate date) {
        Novel novel = Novel.builder()
                .title(title)
                .description(description)
                .author(author)
                .publicationDate(date)
                .status(Novel.Status.Ongoing) // Mặc định là đang tiến hành
                .views(0L)
                .followers(0L)
                .build();

        return novelRepository.save(novel);
    }

    @Transactional
    public Chapter createChapter(Novel novel, String title, Integer chapterNumber, String rawContent) {
        // 1. Khởi tạo Chapter
        Chapter chapter = new Chapter();
        chapter.setNovel(novel);
        chapter.setTitle(title);
        chapter.setChapterNumber(chapterNumber);
        chapter.setUpdatedAt(LocalDate.now());

        // 2. Khởi tạo ChapterContent
        ChapterContent content = new ChapterContent();
        content.setContent(rawContent);

        // 3. Thiết lập mối quan hệ 2 chiều
        // Hàm setContent(content) bạn đã viết trong Entity sẽ tự gọi content.setChapter(this)
        chapter.setContent(content);

        // 4. Lưu vào DB (CascadeType.ALL sẽ tự lưu cả ChapterContent)
        return chapterRepository.save(chapter);
    }
}
