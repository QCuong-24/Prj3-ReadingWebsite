package com.example.readingServer.service;

import com.example.readingServer.entity.OtpCode;
import com.example.readingServer.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;

    // Sinh OTP và gửi qua Gmail
    public OtpCode generateOtp(String email) {
        String code = String.valueOf(new Random().nextInt(900000) + 100000); // 6 số

        OtpCode otp = new OtpCode();
        otp.setEmail(email);
        otp.setCode(code);
        otp.setCreatedAt(LocalDateTime.now());
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otp);

        emailService.sendOtpEmail(email, code);

        return otp;
    }

    // Xác thực OTP
    public boolean validateOtp(String email, String code) {
        OtpCode otp = otpRepository.findTopByEmailAndCodeAndUsedFalseOrderByCreatedAtDesc(email, code)
                .orElseThrow(() -> new RuntimeException("OTP không tồn tại "));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP đã hết hạn");
        }

        otp.setUsed(true);
        otpRepository.save(otp);
        return true;
    }
}