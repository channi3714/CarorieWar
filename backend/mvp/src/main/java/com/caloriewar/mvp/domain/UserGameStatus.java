package com.caloriewar.mvp.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_game_status")
@Getter @Setter
@NoArgsConstructor
public class UserGameStatus {

    @Id
    private Long userId; // @GeneratedValue 없음 (User의 ID를 그대로 PK로 꽂아 1:1 매핑)

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // 유저 식별자를 PK 겸 FK로 사용 (기존 스키마 구조 반영)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore = 0;

    @Column(name = "team_color", nullable = false, length = 7)
    private String teamColor = "#FF5733";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_exercise_id")
    private Exercise currentExercise = null; // 운동 안 할 때는 null!

    @Column(name = "is_working", nullable = false)
    private Boolean isWorking = false;

    @Column(name = "start_latitude")
    private Double startLatitude;

    @Column(name = "start_longitude")
    private Double startLongitude;

    @Column(name = "updated_at", nullable = false, insertable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;

    // 💡 편의 비즈니스 메서드 추가
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