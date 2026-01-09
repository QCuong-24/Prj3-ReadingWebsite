package com.example.readingServer.controller;

import com.example.readingServer.auth.dto.UserDTO;
import com.example.readingServer.auth.AdminService;
import com.example.readingServer.service.SyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final SyncService syncService;

    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public UserDTO getUserById(@PathVariable Long id) {
        return adminService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/users")
    public UserDTO createUser(@RequestBody UserDTO newUser) {
        return adminService.createUser(newUser);
    }

    @PutMapping("/users/{id}")
    public UserDTO updateUser(@PathVariable Long id, @RequestBody UserDTO updatedUser) {
        return adminService.updateUser(id, updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
    }

    @PostMapping("/sync/novels")
    public String syncNovels() throws IOException {
        syncService.syncAllNovels();
        return "Novel synchronization started!";
    }

    @PostMapping("/sync/chapters")
    public String syncChapters() throws IOException {
        syncService.syncAllChapters();
        return "Chapter synchronization started!";
    }

    @GetMapping("/sync/status")
    public ResponseEntity<?> getStatus() {
        return ResponseEntity.ok(Map.of(
                "elasticsearchEnabled", syncService.isElasticsearchEnabled()
        ));
    }

    @PostMapping("/sync/toggle-elastic")
    public ResponseEntity<String> toggleElastic() {
        return ResponseEntity.ok(syncService.toggleElasticsearch());
    }
}