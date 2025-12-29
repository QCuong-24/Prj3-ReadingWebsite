package com.example.readingServer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("yourgmail@gmail.com"); // Gmail bạn cấu hình trong properties
        message.setTo(to);
        message.setSubject("Xác minh đăng ký tài khoản từ Reading Website - Mã OTP");

        message.setText(
                "Kính gửi Quý khách,\n\n" +
                        "Quý khách vừa yêu cầu đăng ký tài khoản trên hệ thống của chúng tôi. " +
                        "Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã OTP dưới đây:\n\n" +
                        "Mã OTP: " + otpCode + "\n\n" +
                        "Lưu ý: Mã OTP này chỉ có hiệu lực trong vòng 5 phút kể từ thời điểm nhận được email. " +
                        "Vui lòng không chia sẻ mã này với bất kỳ ai để đảm bảo an toàn cho tài khoản của Quý khách.\n\n" +
                        "Trân trọng,\n" +
                        "Đội ngũ Hỗ trợ Khách hàng"
        );

        mailSender.send(message);
    }
}