package com.caloriewar.mvp.controller;

import com.caloriewar.mvp.dto.response.ApiResponse;
import com.caloriewar.mvp.dto.response.HomeResponse;
import com.caloriewar.mvp.exception.AuthException;
import com.caloriewar.mvp.service.HomeService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    private final HomeService homeService;

    public HomeController(HomeService homeService) {
        this.homeService = homeService;
    }

    @GetMapping("/home")
    public ResponseEntity<ApiResponse<HomeResponse>> home(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) throw new AuthException("로그인이 필요합니다.");
        HomeResponse data = homeService.getHome(userId);
        return ResponseEntity.ok(ApiResponse.success(200, "홈 조회 성공", data));
    }
}
