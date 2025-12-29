package com.example.readingServer.repository;

import com.example.readingServer.entity.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpCode, Long> {
    Optional<OtpCode> findTopByEmailAndCodeAndUsedFalseOrderByCreatedAtDesc(String email, String code);
}
