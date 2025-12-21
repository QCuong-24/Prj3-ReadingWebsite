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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + request.getEmail()));
        UserDTO dto = mapToDTO(user);

        return new AuthResponse(dto, token, "Login response");
    }

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Role role = switch (request.getRole() == null ? "USER" :
                request.getRole().toUpperCase()) {
            case "MANAGER" -> Role.MANAGER;
            case "ADMIN" -> Role.ADMIN;
            default -> Role.USER;
        };

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .avatarUrl(null)
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
        UserDTO dto = mapToDTO(user);

        return new AuthResponse(dto, token, "Register response");
    }

    //Mapper DTO
    private UserDTO mapToDTO(User user) {
        return new UserDTO(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getRoles()
        );
    }
}