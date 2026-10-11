package com.sms.controller;

import com.sms.dto.LoginRequest;
import com.sms.dto.LoginResponse;
import com.sms.dto.SuperAdminRequest;
import com.sms.entity.User;
import com.sms.service.AuthService;
import com.sms.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(
            AuthService authService,
            UserService userService) {

        this.authService = authService;
        this.userService = userService;
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest loginRequest) {

        LoginResponse response =
                authService.login(loginRequest);

        return ResponseEntity.ok(response);
    }

    // Create First Super Admin
    @PostMapping("/setup-super-admin")
    public ResponseEntity<User> setupSuperAdmin(
            @Valid @RequestBody SuperAdminRequest request) {

        User superAdmin =
                userService.createSuperAdmin(request);

        return new ResponseEntity<>(
                superAdmin,
                HttpStatus.CREATED
        );
    }
}