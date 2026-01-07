package com.example.readingServer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ReadingServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReadingServerApplication.class, args);
	}

}
