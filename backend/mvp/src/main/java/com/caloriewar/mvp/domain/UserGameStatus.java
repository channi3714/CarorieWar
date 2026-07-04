package com.caloriewar.mvp.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_game_status")
@Getter @Setter
@NoArgsConstructor
public class UserGameStatus {

    // 반지름 계산 상수 (게임 밸런스 조정 시 여기만 고치면 됨)
    private static final double BASE_RADIUS = 5.0;
    private static final double SCALE_FACTOR = 0.05;

    @Id
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore = 0;

    @Column(name = "team_color", nullable = false, length = 7)
    private String teamColor = "#FF5733";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_exercise_id")
    private Exercise currentExercise = null;

    @Column(name = "is_working", nullable = false)
    private Boolean isWorking = false;

    @Column(name = "start_latitude")
    private Double startLatitude;

    @Column(name = "start_longitude")
    private Double startLongitude;

    // ===== 반지름 (파생값, DB에 저장하지 않음) =====
    @Transient
    public double getRadius() {
        return BASE_RADIUS + this.totalScore * SCALE_FACTOR;
    }

    // 편의 비즈니스 메서드
    public void startExercise(Exercise exercise, Double lat, Double lng) {
        this.currentExercise = exercise;
        this.isWorking = true;
        this.startLatitude = lat;
        this.startLongitude = lng;
    }

    public void stopExercise() {
        this.currentExercise = null;
        this.isWorking = false;
    }

    public void addScore(int score) {
        this.totalScore += score;
    }
}