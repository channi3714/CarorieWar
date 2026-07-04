package com.caloriewar.mvp.controller;

import com.caloriewar.mvp.dto.request.LoginRequest;
import com.caloriewar.mvp.dto.response.ApiResponse;
import com.caloriewar.mvp.dto.response.AuthResponse;
import com.caloriewar.mvp.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
        @RequestBody LoginRequest request,
        HttpSession session
    ) {
        AuthResponse data = authService.login(request, session);
        return ResponseEntity.ok(ApiResponse.success(200, "로그인 성공", data));
    }
}
