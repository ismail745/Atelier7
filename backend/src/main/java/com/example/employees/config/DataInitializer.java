package com.example.employees.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.employees.entity.UserAccount;
import com.example.employees.repository.UserAccountRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userAccountRepository.existsByUsername("admin")) {
            UserAccount admin = UserAccount.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("password123"))
                    .role("ADMIN")
                    .build();
            userAccountRepository.save(admin);
        }
    }
}

