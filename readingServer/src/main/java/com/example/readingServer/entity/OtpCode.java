package com.example.readingServer.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_codes")
@Getter
@Setter @NoArgsConstructor @AllArgsConstructor
public class OtpCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;          // email nhận OTP
    private String code;           // mã OTP
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private Boolean used = false;
}
