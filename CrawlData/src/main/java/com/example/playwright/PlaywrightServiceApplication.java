package com.example.playwright;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.Async;

@SpringBootApplication
@Async
public class PlaywrightServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(PlaywrightServiceApplication.class, args);
    }
}
