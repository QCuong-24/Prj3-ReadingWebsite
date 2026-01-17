package com.example.playwright.service;

import com.example.playwright.entity.Novel;
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.WaitUntilState;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.nio.file.*;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class PlaywrightRunner {
    private static final Logger logger = LoggerFactory.getLogger(PlaywrightRunner.class);
    private final AddDatabaseService dtbService;

    private Playwright playwright;
    private BrowserContext context;

    @PostConstruct
    public void init() {
        Path userDataDir = Paths.get("novelbin_data");

        // Xóa thư mục cũ nếu tồn tại
        if (Files.exists(userDataDir)) {
            try {
                Files.walk(userDataDir)
                        .sorted(Comparator.reverseOrder())
                        .forEach(path -> {
                            try {
                                Files.delete(path);
                            } catch (IOException e) {
                                // Coi chừng lỗi nếu có file đang bị khóa
                                logger.warn("Không thể xóa file: " + path);
                            }
                        });
                logger.info("Đã xóa dữ liệu Persistent cũ.");
            } catch (IOException e) {
                logger.error("Lỗi khi dọn dẹp thư mục data: " + e.getMessage());
            }
        }

        playwright = Playwright.create();

        // 1. Sử dụng Persistent Context để lưu lại Cookie và Session
        // Thư mục 'novelbin_data' sẽ được tạo ngay trong project của bạn
        BrowserType.LaunchPersistentContextOptions launchOptions = new BrowserType.LaunchPersistentContextOptions()
                .setHeadless(false) // Để false để bạn có thể bấm Verify lần đầu
                .setArgs(List.of(
                        "--no-sandbox",
                        "--disable-blink-features=AutomationControlled", // Ẩn cờ Automation
//                        "--incognito",
                        "--disable-sync",     // Tắt đồng bộ tài khoản Google
                        "--disable-history-summary", // Tắt lưu lịch sử
                        "--no-first-run"
                ));

        context = playwright.chromium().launchPersistentContext(userDataDir, launchOptions);

        // 2. Xóa bỏ dấu vết navigator.webdriver để pass bài test Sannysoft
        context.addInitScript("() => {" +
                "  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });" +
                "  window.chrome = { runtime: {} };" +
                "  Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });" +
                "  Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });" +
                "}");

        // Thiết lập timeout mặc định cho toàn bộ context
        context.setDefaultTimeout(60000);
    }

    @PreDestroy
    public void cleanup() {
        if (context != null) context.close();
        if (playwright != null) playwright.close();
    }

    public Novel fetchNovel(String novelUrl) {
        try (Page page = context.newPage()) {
            logger.info("Đang lấy thông tin bộ truyện: {}", novelUrl);
            page.navigate(novelUrl, new Page.NavigateOptions().setWaitUntil(WaitUntilState.DOMCONTENTLOADED));

            // Xử lý Cloudflare nếu có
            checkAndHandleVerify(page);

            // 1. Lấy Title
            String title = page.locator("div.col-xs-12.col-sm-8.col-md-8.desc h3.title").innerText().trim();

            // 2. Lấy Author (thường nằm trong thẻ info)
            String author = "Unknown";
            Locator authorLocator = page.locator("ul.info li:has(h3:text('Author:')) a");
            if (authorLocator.count() > 0) {
                author = authorLocator.first().innerText().trim();
            }

            // 3. Lấy Description
            // Novelbin thường để description trong div .desc-text
            String description = page.locator("#tab-description .desc-text").innerText().trim();

            // 4. Lấy Cover Image URL
            String coverImageUrl = null;

            // 5. Lấy Status
            Novel.Status status = Novel.Status.Ongoing;

            logger.info("Crawl thông tin Novel thành công: {} {}", title, author);

            return Novel.builder()
                    .title(title)
                    .author(author)
                    .description(description)
                    .coverImageUrl(coverImageUrl)
                    .status(status)
                    .publicationDate(LocalDate.now())
                    .build();

        } catch (Exception e) {
            logger.error("Lỗi khi fetchNovel: {}", e.getMessage());
            return null;
        }
    }

    public void fetchAllChaptersAndSave(String novelUrl, Novel novel) {
        try (Page page = context.newPage()) {
            logger.info("Đang lấy danh sách chương từ: {}", novelUrl);
            page.navigate(novelUrl, new Page.NavigateOptions().setWaitUntil(WaitUntilState.DOMCONTENTLOADED));

            checkAndHandleVerify(page);

            // Lấy danh sách tất cả các thẻ <a> chứa link chương
            List<ElementHandle> anchors = page.locator("ul.list-chapter li a").elementHandles();
            List<String> links = new ArrayList<>();
            for (ElementHandle anchor : anchors) {
                String href = anchor.getAttribute("href");
                if (href != null) links.add(href);
            }

            logger.info("Tìm thấy {} chương. Bắt đầu lưu vào DB...", links.size());

            int maxNumber = 6;//(int)(100 * Math.random());
            for (int i = 0; i < links.size(); i++) {
                String link = links.get(i);
                int currentNum = i + 1;
                if (currentNum % 5 == 0) clearData();
                if (i > maxNumber) break;

                try {
                    // 1. Fetch dữ liệu từ trang chương
                    Map<String, Object> chData = fetchSingleChapter(link);

                    if (chData != null && !chData.containsKey("error")) {
                        String title = (String) chData.get("title");     // "Chapter 1: The Apocalypse Descends"
                        String content = (String) chData.get("content"); // Nội dung có chứa \n

                        // 2. Lưu trực tiếp vào Postgres thông qua Service
                        dtbService.createChapter(novel, title, currentNum, content);

                        logger.info(">>> Đã lưu thành công chương {}: {}", currentNum, title);
                    }
                } catch (Exception e) {
                    logger.error("Lỗi tại chương {}: {}", currentNum, e.getMessage());
                }

                // Nghỉ 1-2 giây để giả lập người dùng thật và tránh bị Cloudflare chặn
                Thread.sleep((long) (Math.random() * 2000) + 1000);
            }
        } catch (Exception e) {
            logger.error("Lỗi hệ thống khi crawl: ", e);
        }
    }

    public List<Map<String, Object>> fetchAllChapters(String novelUrl) {
        List<Map<String, Object>> chapters = new ArrayList<>();

        // Sử dụng chung context đã khởi tạo để tận dụng Cookie
        try (Page page = context.newPage()) {
            logger.info("Đang truy cập danh sách chương: {}", novelUrl);
            page.navigate(novelUrl, new Page.NavigateOptions().setWaitUntil(WaitUntilState.DOMCONTENTLOADED));

            // Đợi nếu gặp Verify (Bạn tự bấm hoặc code tự đợi)
            checkAndHandleVerify(page);

            // Lấy danh sách link chương
            List<ElementHandle> anchors = page.locator("ul.list-chapter li a").elementHandles();
            List<String> links = new ArrayList<>();
            for (ElementHandle anchor : anchors) {
                String href = anchor.getAttribute("href");
                if (href != null) links.add(href);
            }

            for (int i = 0; i < links.size(); i++) {
                String link = links.get(i);
                logger.info("Đang crawl ({}/{}): {}", (i + 1), links.size(), link);

                Map<String, Object> chapterData = fetchSingleChapter(link);
                chapters.add(chapterData);

                // Nghỉ ngẫu nhiên để tránh bị phát hiện lại
                Thread.sleep((long) (Math.random() * 3000) + 2000);
            }
        } catch (Exception e) {
            logger.error("Lỗi tổng quát: ", e);
        }
        return chapters;
    }

    public Map<String, Object> fetchSingleChapter(String url) {
        Map<String, Object> result = new HashMap<>();

        // Xóa sạch cookie của phiên trước đó để mỗi chương là một 'phiên ẩn danh' mới
        context.clearCookies();
        try (Page page = context.newPage()) {
            setupRouteInterception(page);
            page.navigate(url, new Page.NavigateOptions().setWaitUntil(WaitUntilState.DOMCONTENTLOADED));

            // Kiểm tra và chờ nội dung xuất hiện
            checkAndHandleVerify(page);

            Locator contentLocator = page.locator("#chr-content");
            contentLocator.waitFor(new Locator.WaitForOptions().setTimeout(30000));

            String title = page.locator(".chr-text").first().innerText();
            String content = contentLocator.innerText();

            result.put("title", title);
            result.put("url", url);
            result.put("content", content);

            logger.info("Thành công: {}", title);

        } catch (Exception e) {
            logger.warn("Lỗi khi tải chương {}: {}", url, e.getMessage());
            result.put("url", url);
            result.put("error", e.getMessage());
        }
        return result;
    }

    private void checkAndHandleVerify(Page page) {
        // Nếu thấy màn hình Verify, code sẽ đợi tối đa 30s để bạn bấm hoặc tự động load
        if (page.title().contains("Just a moment") || page.isVisible("text='Verify you are human'")) {
            logger.warn(">>> VUI LÒNG BẤM VERIFY TRÊN TRÌNH DUYỆT <<<");
            clearData();
            // Đợi đến khi selector nội dung truyện xuất hiện
            try {
                page.waitForSelector("#chr-content", new Page.WaitForSelectorOptions().setTimeout(45000));
                logger.info("Verify thành công, tiếp tục crawl...");
            } catch (Exception e) {
                logger.error("Quá thời gian chờ Verify!");
            }
        }
    }

    private void setupRouteInterception(Page page) {
        page.route("**/*", route -> {
            String type = route.request().resourceType();
            // Không chặn stylesheet vì một số web dùng CSS để kiểm tra bot
            if (List.of("image", "media", "font").contains(type)) {
                route.abort();
            } else {
                route.resume();
            }
        });
    }

    public void clearData() {
        // 1. Xóa sạch Cookies của toàn bộ Context
        context.clearCookies();

        // 2. Xóa Storage và Cache thông qua JavaScript trên một trang
        try (Page page = context.newPage()) {
            page.navigate("https://novelbin.com"); // Phải điều hướng tới domain để xóa
            page.evaluate("() => {" +
                    "  localStorage.clear();" +
                    "  sessionStorage.clear();" +
                    "  caches.keys().then(names => names.forEach(n => caches.delete(n)));" +
                    "}");

            Thread.sleep((long)(2000*Math.random()));
        } catch (Exception e) {
            logger.error("Lỗi tổng quát: ", e);
        }
    }
}