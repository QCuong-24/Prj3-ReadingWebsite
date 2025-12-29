package com.example.readingServer.auth;

import com.example.readingServer.entity.User;
import com.example.readingServer.auth.dto.UserDTO;
import com.example.readingServer.exception.ResourceNotFoundException;
import com.example.readingServer.repository.UserRepository;
import com.example.readingServer.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private UserDTO convertToDTO(User user) {
        return new UserDTO(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getRoles()
        );
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO);
    }

    public UserDTO updateUser(Long id, UserDTO updatedUserDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // Check email (except the current one)
        if (!user.getEmail().equals(updatedUserDTO.getEmail())
                && userRepository.existsByEmail(updatedUserDTO.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        // Cập nhật thông tin
        user.setUsername(updatedUserDTO.getUsername());
        user.setEmail(updatedUserDTO.getEmail());
        user.setAvatarUrl(updatedUserDTO.getAvatarUrl());
        user.setRoles(updatedUserDTO.getRoles());

        // Notification khi reply
        notificationService.createNotification(
                id,
                "AUTHORITY_CHANGE",
                "Vai trò của bạn đã thay đổi",
                "Vui lòng log in để lấy lại token",
                "/login"
        );

        User saved = userRepository.save(user);
        return convertToDTO(saved);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}