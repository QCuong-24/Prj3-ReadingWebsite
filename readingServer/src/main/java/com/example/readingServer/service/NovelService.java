package com.example.readingServer.service;

import com.example.readingServer.entity.NovelFollow;
import com.example.readingServer.entity.User;
import com.example.readingServer.repository.NovelFollowRepository;
import com.example.readingServer.repository.UserRepository;
import com.example.readingServer.service.dto.NovelDTO;
import com.example.readingServer.exception.ResourceNotFoundException;
import com.example.readingServer.entity.Novel;
import com.example.readingServer.repository.NovelRepository;
import com.example.readingServer.service.mapper.SearchMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class NovelService {

    private final NovelRepository novelRepository;
    private final NovelFollowRepository novelFollowRepository;
    private final UserRepository userRepository;

    private final ElasticService elasticService;
    private final SearchMapper searchMapper;

    @Value("${app.elasticsearch.enabled:false}")
    private boolean isElasticEnabled;

    // Mapping Methods

    private NovelDTO mapToDTO(Novel novel) {
        return new NovelDTO(
                novel.getNovelId(),
                novel.getTitle(),
                novel.getDescription(),
                novel.getAuthor(),
                novel.getStatus().name(),
                novel.getPublicationDate(),
                novel.getCoverImageUrl(),
                novel.getViews(),
                novel.getFollowers()
        );
    }

    private Novel mapToEntity(NovelDTO dto) {
        Novel novel = new Novel();
        novel.setNovelId(dto.getId());
        novel.setTitle(dto.getTitle());
        novel.setDescription(dto.getDescription());
        novel.setAuthor(dto.getAuthor());

        if (dto.getStatus() != null) {
            novel.setStatus(Novel.Status.valueOf(dto.getStatus()));
        }

        novel.setPublicationDate(dto.getPublicationDate());
        novel.setCoverImageUrl(dto.getCoverImageUrl());
        novel.setViews(dto.getViews());
        novel.setFollowers(dto.getFollowers());

        return novel;
    }

    // CRUD Methods

    @Transactional(readOnly = true)
    public List<NovelDTO> findAll() {
        return novelRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<NovelDTO> findAllByPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return novelRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public NovelDTO findById(Long id) {
        Novel novel = novelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Novel", "id", id));
        return mapToDTO(novel);
    }

    public NovelDTO create(NovelDTO dto) {
        Novel novel = mapToEntity(dto);
        Novel saved = novelRepository.save(novel);
        if (isElasticEnabled) {
            try {
                elasticService.indexNovel(searchMapper.toNovelDocument(saved));
            } catch (Exception e) {
                // Log lỗi nhưng không làm rollback transaction chính của DB (tùy bạn quyết định)
                System.err.println("Elasticsearch Sync Error: " + e.getMessage());
            }
        }
        return mapToDTO(saved);
    }

    public NovelDTO update(Long id, NovelDTO dto) {
        Novel novel = novelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Novel", "id", id));

        novel.setTitle(dto.getTitle());
        novel.setAuthor(dto.getAuthor());
        novel.setDescription(dto.getDescription());
        if (dto.getStatus() != null) {
            novel.setStatus(Novel.Status.valueOf(dto.getStatus()));
        }
        //novel.setPublicationDate(dto.getPublicationDate());

        Novel updated = novelRepository.save(novel);
        if (isElasticEnabled) {
            try {
                elasticService.indexNovel(searchMapper.toNovelDocument(updated));
            } catch (Exception e) {
                System.err.println("Elasticsearch Update Error: " + e.getMessage());
            }
        }
        return mapToDTO(updated);
    }

    public void delete(Long id) {
        Novel novel = novelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Novel", "id", id));
        novelRepository.delete(novel);

        if (isElasticEnabled) {
            try {
                elasticService.deleteNovel(id);
            } catch (Exception e) {
                System.err.println("Elasticsearch Delete Error: " + e.getMessage());
            }
        }
    }

    // View

    public void increaseView(Long novelId) {
        if (!novelRepository.existsById(novelId)) {
            throw new ResourceNotFoundException("Novel", "id", novelId);
        }
        novelRepository.increaseViews(novelId);
    }

    // Follow

    public void followNovel(Long userId, Long novelId) {

        if (novelFollowRepository.existsByUser_UserIdAndNovel_NovelId(userId, novelId)) {
            throw new IllegalStateException("User already followed this novel");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Novel novel = novelRepository.findById(novelId)
                .orElseThrow(() -> new ResourceNotFoundException("Novel", "id", novelId));

        NovelFollow follow = new NovelFollow();
        follow.setUser(user);
        follow.setNovel(novel);

        novelFollowRepository.save(follow);
        novelRepository.increaseFollowers(novelId);
    }

    public void unfollowNovel(Long userId, Long novelId) {

        NovelFollow follow = novelFollowRepository
                .findByUser_UserIdAndNovel_NovelId(userId, novelId)
                .orElseThrow(() ->
                        new IllegalStateException("User is not following this novel"));

        novelFollowRepository.delete(follow);
        novelRepository.decreaseFollowers(novelId);
    }

    @Transactional(readOnly = true)
    public List<NovelDTO> getFollowedNovels(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }

        return novelFollowRepository.findByUser_UserId(userId)
                .stream()
                .map(NovelFollow::getNovel)
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public boolean isFollowedByUser(Long novelId, Long userId) {
        return novelFollowRepository.existsByUser_UserIdAndNovel_NovelId(userId, novelId);
    }
}