package com.example.readingServer.auth;

import com.example.readingServer.auth.dto.*;
import com.example.readingServer.entity.Role;
import com.example.readingServer.entity.User;
import com.example.readingServer.repository.UserRepository;
import com.example.readingServer.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse login(LoginRequest request) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token);
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Role role = switch (request.getRole() == null ? "USER" :
                request.getRole().toUpperCase()) {
            case "MANAGER" -> Role.ROLE_MANAGER;
            case "ADMIN" -> Role.ROLE_ADMIN;
            default -> Role.ROLE_USER;
        };

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .avatar_url(null)
                .roles(Set.of(role))
                .build();

        userRepository.save(user);

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .authorities(user.getRoles().stream()
                                .map(r -> r.name())
                                .toArray(String[]::new))
                        .build();

        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token);
    }
}