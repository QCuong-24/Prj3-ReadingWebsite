package com.example.readingServer.service;

import com.example.readingServer.service.dto.NovelDTO;
import com.example.readingServer.exception.ResourceNotFoundException;
import com.example.readingServer.entity.Novel;
import com.example.readingServer.repository.NovelRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NovelService {

    private final NovelRepository novelRepository;

    public NovelService(NovelRepository novelRepository) {
        this.novelRepository = novelRepository;
    }

    // Mapping Methods

    private NovelDTO mapToDTO(Novel novel) {
        return new NovelDTO(
                novel.getNovelId(),
                novel.getTitle(),
                novel.getDescription(),
                novel.getAuthor(),
                novel.getStatus().name()
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

        return novel;
    }

    // CRUD Methods

    public List<NovelDTO> findAll() {
        return novelRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public Page<NovelDTO> findAllByPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return novelRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    public NovelDTO findById(Long id) {
        Novel novel = novelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Novel", "id", id));
        return mapToDTO(novel);
    }

    public NovelDTO create(NovelDTO dto) {
        Novel novel = mapToEntity(dto);
        Novel saved = novelRepository.save(novel);
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

        Novel updated = novelRepository.save(novel);
        return mapToDTO(updated);
    }

    public void delete(Long id) {
        Novel novel = novelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Novel", "id", id));
        novelRepository.delete(novel);
    }
}