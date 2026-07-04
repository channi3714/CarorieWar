package com.caloriewar.mvp.service;

import com.caloriewar.mvp.domain.UserGameStatus;
import com.caloriewar.mvp.dto.request.StartWorkingRequest;
import com.caloriewar.mvp.dto.response.NearbyPlayerDto;
import com.caloriewar.mvp.dto.response.ScoreResponse;
import com.caloriewar.mvp.dto.response.WorkingInfoResponse;
import com.caloriewar.mvp.exception.NotFoundException;
import com.caloriewar.mvp.repository.UserGameStatusRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class WorkingService {

    private static final int SCORE_PER_CALL = 10;

    // 이벤트 우선순위 (높을수록 우선)
    private static final int PRIORITY_NONE = 0;
    private static final int PRIORITY_MEETING = 1;
    private static final int PRIORITY_CONQUERED_BY = 2;
    private static final int PRIORITY_CONQUERED = 3;

    private final UserGameStatusRepository userGameStatusRepository;

    public WorkingService(UserGameStatusRepository userGameStatusRepository) {
        this.userGameStatusRepository = userGameStatusRepository;
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
    public ScoreResponse addScore(Long userId) {
        UserGameStatus mine = userGameStatusRepository.findById(userId).orElseThrow();

        if (mine.getCurrentExercise() == null) {
            throw new NotFoundException("선택된 운동이 없습니다.");
        }
        if (mine.getStartLatitude() == null || mine.getStartLongitude() == null) {
            throw new NotFoundException("운동 시작 위치가 설정되지 않았습니다.");
        }

        mine.addScore(SCORE_PER_CALL);
        userGameStatusRepository.save(mine);

        double myLat = mine.getStartLatitude();
        double myLng = mine.getStartLongitude();
        double myRadius = mine.getRadius();

        List<UserGameStatus> others = userGameStatusRepository.findByIsWorkingTrue().stream()
                .filter(s -> !s.getUserId().equals(userId))
                .toList();

        List<NearbyPlayerDto> nearbyPlayers = new ArrayList<>();
        String bestEventType = null;
        String bestOpponentNick = null;
        int bestPriority = PRIORITY_NONE;

        for (UserGameStatus other : others) {
            double theirLat = other.getStartLatitude();
            double theirLng = other.getStartLongitude();
            double theirRadius = other.getRadius();
            double distance = haversine(myLat, myLng, theirLat, theirLng);

            nearbyPlayers.add(new NearbyPlayerDto(
                    other.getUser().getNickname(),
                    theirLat,
                    theirLng,
                    other.getTotalScore(),
                    theirRadius,
                    other.getTeamColor()
            ));

            // 이벤트 판정
            String eventType = null;
            if (distance <= myRadius && myRadius >= theirRadius) {
                // 내 반지름이 상대 중심까지 도달 + 내가 더 크거나 같음 → 정복
                other.setTeamColor(mine.getTeamColor());
                userGameStatusRepository.save(other);
                eventType = "CONQUERED";
            } else if (distance <= theirRadius && theirRadius > myRadius) {
                // 상대 반지름이 내 중심까지 도달 + 상대가 더 큼 → 피정복
                mine.setTeamColor(other.getTeamColor());
                userGameStatusRepository.save(mine);
                eventType = "CONQUERED_BY_OPPONENT";
            } else if (distance <= myRadius + theirRadius) {
                // 원이 겹침 → 만남
                eventType = "MEETING";
            }

            int priority = priority(eventType);
            if (priority > bestPriority) {
                bestPriority = priority;
                bestEventType = eventType;
                bestOpponentNick = other.getUser().getNickname();
            }
        }

        return new ScoreResponse(mine.getTotalScore(), myRadius, nearbyPlayers, bestEventType, bestOpponentNick);
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