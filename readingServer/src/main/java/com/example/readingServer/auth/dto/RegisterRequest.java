package com.example.readingServer.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String username;

    @Email
    private String email;

    @NotBlank
    private String password;

    private String role;

    private String otpCode;
}
