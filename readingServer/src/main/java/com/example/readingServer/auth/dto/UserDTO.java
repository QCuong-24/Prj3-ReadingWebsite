package com.example.readingServer.auth.dto;

import com.example.readingServer.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long userId;

    @NotBlank
    private String username;

    @Email @NotBlank
    private String email;

    private String avatarUrl;

    private Set<Role> roles;
}