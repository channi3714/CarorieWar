package com.caloriewar.mvp.service;

import com.caloriewar.mvp.domain.UserGameStatus;
import com.caloriewar.mvp.dto.request.StartWorkingRequest;
import com.caloriewar.mvp.dto.response.NearbyPlayerDto;
import com.caloriewar.mvp.dto.response.ScoreResponse;
import com.caloriewar.mvp.dto.response.WorkingInfoResponse;
import com.caloriewar.mvp.exception.NotFoundException;
import com.caloriewar.mvp.repository.UserExerciseRepository;
import com.caloriewar.mvp.repository.UserGameStatusRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class WorkingService {

    private static final int SCORE_PER_CALL = 10;
    private static final double BASE_RADIUS = 5.0;
    private static final double SCALE_FACTOR = 0.05;

    private static final int PRIORITY_NONE = 0;
    private static final int PRIORITY_MEETING = 1;
    private static final int PRIORITY_CONQUERED_BY = 2;
    private static final int PRIORITY_CONQUERED = 3;

    private final UserGameStatusRepository userGameStatusRepository;
    private final UserExerciseRepository userExerciseRepository;

    public WorkingService(UserGameStatusRepository userGameStatusRepository,
                          UserExerciseRepository userExerciseRepository) {
        this.userGameStatusRepository = userGameStatusRepository;
        this.userExerciseRepository = userExerciseRepository;
    }

    @Transactional(readOnly = true)
    public WorkingInfoResponse getWorkingInfo(Long userId) {
        UserGameStatus status = userGameStatusRepository.findById(userId).orElseThrow();
        if (status.getCurrentExercise() == null) {
            throw new NotFoundException("선택된 운동이 없습니다.");
        }
        return new WorkingInfoResponse(
            status.getCurrentExercise().getId(),
            status.getCurrentExercise().getName(),
            status.getTotalScore(),
            status.getCurrentExercise().getCaloriesPerFiveMin()
        );
    }

    @Transactional
    public void startWorking(Long userId, StartWorkingRequest request) {
        UserGameStatus status = userGameStatusRepository.findById(userId).orElseThrow();
        status.setStartLatitude(request.getLatitude());
        status.setStartLongitude(request.getLongitude());
        status.setIsWorking(true);
        userGameStatusRepository.save(status);
    }

    @Transactional
    public void stopWorking(Long userId) {
        UserGameStatus status = userGameStatusRepository.findById(userId).orElseThrow();

        // 선택된 운동 isSelected → false
        userExerciseRepository.findByUserAndIsSelectedTrue(status.getUser())
            .ifPresent(ue -> {
                ue.setIsSelected(false);
                userExerciseRepository.save(ue);
            });

        status.setIsWorking(false);
        status.setCurrentExercise(null);
        userGameStatusRepository.save(status);
    }

    @Transactional
    public ScoreResponse addScore(Long userId) {
        UserGameStatus mine = userGameStatusRepository.findById(userId).orElseThrow();

        if (mine.getCurrentExercise() == null) {
            throw new NotFoundException("선택된 운동이 없습니다.");
        }
        if (mine.getStartLatitude() == null || mine.getStartLongitude() == null) {
            throw new NotFoundException("운동 시작 위치가 고정되지 않았습니다.");
        }

        // 1. 내 점수 적립
        mine.addScore(SCORE_PER_CALL);
        userGameStatusRepository.save(mine);

        // 2. 운동 중인 전체 유저 조회
        List<UserGameStatus> allWorking = userGameStatusRepository.findByIsWorkingTrue();

        // 3. 모든 쌍(pair) 충돌 판정 — 나 vs 남, 남 vs 남 전부 처리
        String myEventType = null;
        String myEventOpponent = null;
        int myBestPriority = PRIORITY_NONE;

        for (int i = 0; i < allWorking.size(); i++) {
            for (int j = i + 1; j < allWorking.size(); j++) {
                UserGameStatus a = allWorking.get(i);
                UserGameStatus b = allWorking.get(j);

                double radiusA = BASE_RADIUS + a.getTotalScore() * SCALE_FACTOR;
                double radiusB = BASE_RADIUS + b.getTotalScore() * SCALE_FACTOR;
                double distance = haversine(
                    a.getStartLatitude(), a.getStartLongitude(),
                    b.getStartLatitude(), b.getStartLongitude()
                );

                boolean aConquersB = distance <= radiusA && radiusA >= radiusB;
                boolean bConquersA = distance <= radiusB && radiusB > radiusA;
                boolean meeting = !aConquersB && !bConquersA && distance <= radiusA + radiusB;

                // 팀 색 변경 (쌍 관계없이 적용)
                if (aConquersB) {
                    b.setTeamColor(a.getTeamColor());
                    userGameStatusRepository.save(b);
                } else if (bConquersA) {
                    a.setTeamColor(b.getTeamColor());
                    userGameStatusRepository.save(a);
                }

                // 나(호출자)가 포함된 쌍이면 이벤트 집계
                boolean iAmA = a.getUserId().equals(userId);
                boolean iAmB = b.getUserId().equals(userId);
                if (!iAmA && !iAmB) continue;

                String myEvent = null;
                if (aConquersB) {
                    myEvent = iAmA ? "CONQUERED" : "CONQUERED_BY_OPPONENT";
                } else if (bConquersA) {
                    myEvent = iAmB ? "CONQUERED" : "CONQUERED_BY_OPPONENT";
                } else if (meeting) {
                    myEvent = "MEETING";
                }

                int priority = priority(myEvent);
                if (priority > myBestPriority) {
                    myBestPriority = priority;
                    myEventType = myEvent;
                    myEventOpponent = iAmA
                        ? b.getUser().getNickname()
                        : a.getUser().getNickname();
                }
            }
        }

        // 4. 응답 조립
        double myRadius = BASE_RADIUS + mine.getTotalScore() * SCALE_FACTOR;
        List<NearbyPlayerDto> nearbyPlayers = allWorking.stream()
            .filter(s -> !s.getUserId().equals(userId))
            .map(s -> new NearbyPlayerDto(
                s.getUser().getNickname(),
                s.getStartLatitude(),
                s.getStartLongitude(),
                null,
                BASE_RADIUS + s.getTotalScore() * SCALE_FACTOR,
                s.getTeamColor()
            ))
            .toList();

        return new ScoreResponse(mine.getTotalScore(), myRadius, nearbyPlayers, myEventType, myEventOpponent);
    }

    // Haversine 공식 — 두 좌표 사이 거리(미터)
    private double haversine(double lat1, double lng1, double lat2, double lng2) {
        final double R = 6371000.0; // 지구 반지름(미터)
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
            * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private int priority(String eventType) {
        if (eventType == null) return PRIORITY_NONE;
        return switch (eventType) {
            case "CONQUERED" -> PRIORITY_CONQUERED;
            case "CONQUERED_BY_OPPONENT" -> PRIORITY_CONQUERED_BY;
            case "MEETING" -> PRIORITY_MEETING;
            default -> PRIORITY_NONE;
        };
    }
}
