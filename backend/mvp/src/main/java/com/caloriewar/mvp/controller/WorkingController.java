package com.caloriewar.mvp.controller;

import com.caloriewar.mvp.dto.request.StartWorkingRequest;
import com.caloriewar.mvp.dto.response.ApiResponse;
import com.caloriewar.mvp.dto.response.ScoreResponse;
import com.caloriewar.mvp.dto.response.WorkingInfoResponse;
import com.caloriewar.mvp.exception.AuthException;
import com.caloriewar.mvp.service.WorkingService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/working")
public class WorkingController {

    private final WorkingService workingService;

    public WorkingController(WorkingService workingService) {
        this.workingService = workingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<WorkingInfoResponse>> getWorkingInfo(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) throw new AuthException("로그인이 필요합니다.");
        return ResponseEntity.ok(ApiResponse.success(200, "운동 화면 조회 성공", workingService.getWorkingInfo(userId)));
    }

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<Void>> startWorking(@RequestBody StartWorkingRequest request, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) throw new AuthException("로그인이 필요합니다.");
        workingService.startWorking(userId, request);
        return ResponseEntity.ok(ApiResponse.success(200, "운동 시작 위치 저장 완료"));
    }

    @GetMapping("/score")
    public ResponseEntity<ApiResponse<ScoreResponse>> addScore(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) throw new AuthException("로그인이 필요합니다.");
        return ResponseEntity.ok(ApiResponse.success(200, "점수 적립 성공", workingService.addScore(userId)));
    }

    @PostMapping("/stop")
    public ResponseEntity<ApiResponse<Void>> stopWorking(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) throw new AuthException("로그인이 필요합니다.");
        workingService.stopWorking(userId);
        return ResponseEntity.ok(ApiResponse.success(200, "운동 종료 완료"));
    }
}
