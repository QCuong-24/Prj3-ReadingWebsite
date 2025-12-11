package com.example.readingServer.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private UserDTO user;

    private String token;

    private String message;
}
