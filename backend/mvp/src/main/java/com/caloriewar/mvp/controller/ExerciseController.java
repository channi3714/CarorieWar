package com.caloriewar.mvp.controller;

import com.caloriewar.mvp.dto.request.AddExerciseRequest;
import com.caloriewar.mvp.dto.request.SelectExerciseRequest;
import com.caloriewar.mvp.dto.response.ApiResponse;
import com.caloriewar.mvp.dto.response.SportResponse;
import com.caloriewar.mvp.exception.AuthException;
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
        if (userId == null) throw new AuthException("로그인이 필요합니다.");
        return ResponseEntity.ok(ApiResponse.success(200, "내 운동 리스트 조회 성공", exerciseService.getMySports(userId)));
    }

    @PostMapping("/my-sports")
    public ResponseEntity<ApiResponse<Void>> selectExercise(@RequestBody SelectExerciseRequest request, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) throw new AuthException("로그인이 필요합니다.");
        exerciseService.selectExercise(userId, request);
        return ResponseEntity.ok(ApiResponse.success(200, "운동 선택 완료"));
    }

    @GetMapping("/all-sports")
    public ResponseEntity<ApiResponse<List<SportResponse>>> getAllSports(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) throw new AuthException("로그인이 필요합니다.");
        return ResponseEntity.ok(ApiResponse.success(200, "전체 운동 리스트 조회 성공", exerciseService.getAllSports(userId)));
    }

    @PostMapping("/all-sports")
    public ResponseEntity<ApiResponse<Void>> addExercise(@RequestBody AddExerciseRequest request, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) throw new AuthException("로그인이 필요합니다.");
        exerciseService.addExercise(userId, request);
        return ResponseEntity.ok(ApiResponse.success(200, "운동 추가 완료"));
    }

    @DeleteMapping("/my-sports/{exerciseId}")
    public ResponseEntity<ApiResponse<Void>> deleteExercise(@PathVariable Long exerciseId, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) throw new AuthException("로그인이 필요합니다.");
        exerciseService.deleteExercise(userId, exerciseId);
        return ResponseEntity.ok(ApiResponse.success(200, "운동 삭제 완료"));
    }
}
