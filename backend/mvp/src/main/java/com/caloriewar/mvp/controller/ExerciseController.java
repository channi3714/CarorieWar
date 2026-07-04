package com.caloriewar.mvp.controller;

import com.caloriewar.mvp.dto.request.AddExerciseRequest;
import com.caloriewar.mvp.dto.request.SelectExerciseRequest;
import com.caloriewar.mvp.dto.response.ApiResponse;
import com.caloriewar.mvp.dto.response.SportResponse;
import com.caloriewar.mvp.service.ExerciseService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @GetMapping("/my-sports")
    public ResponseEntity<ApiResponse<List<SportResponse>>> getMySports(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        List<SportResponse> data = exerciseService.getMySports(userId);
        return ResponseEntity.ok(ApiResponse.success(200, "내 운동 리스트 조회 성공", data));
    }

    @PostMapping("/my-sports")
    public ResponseEntity<ApiResponse<Void>> selectExercise(
        @RequestBody SelectExerciseRequest request,
        HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("userId");
        exerciseService.selectExercise(userId, request);
        return ResponseEntity.ok(ApiResponse.success(200, "운동 선택 완료"));
    }

    @GetMapping("/all-sports")
    public ResponseEntity<ApiResponse<List<SportResponse>>> getAllSports(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        List<SportResponse> data = exerciseService.getAllSports(userId);
        return ResponseEntity.ok(ApiResponse.success(200, "전체 운동 리스트 조회 성공", data));
    }

    @PostMapping("/all-sports")
    public ResponseEntity<ApiResponse<Void>> addExercise(
        @RequestBody AddExerciseRequest request,
        HttpSession session
    ) {
        Long userId = (Long) session.getAttribute("userId");
        exerciseService.addExercise(userId, request);
        return ResponseEntity.ok(ApiResponse.success(200, "운동 추가 완료"));
    }
}
