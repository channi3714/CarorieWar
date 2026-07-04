package com.caloriewar.mvp.service;

import com.caloriewar.mvp.repository.UserGameStatusRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ScoreScheduler {

    private static final int SCORE_PER_TICK = 10;

    private final UserGameStatusRepository userGameStatusRepository;

    public ScoreScheduler(UserGameStatusRepository userGameStatusRepository) {
        this.userGameStatusRepository = userGameStatusRepository;
    }

    // 3초마다 isWorking=true인 모든 유저 점수 적립 (운동별 칼로리 기반)
    @Scheduled(fixedDelay = 3000)
    @Transactional
    public void addScoreToAllWorking() {
        var workingUsers = userGameStatusRepository.findByIsWorkingTrue();
        workingUsers.forEach(s -> {
            int tick = (s.getCurrentExercise() != null)
                ? Math.max(1, s.getCurrentExercise().getCaloriesPerFiveMin() / 5)
                : SCORE_PER_TICK;
            s.addScore(tick);
        });
        userGameStatusRepository.saveAll(workingUsers);
    }
}
