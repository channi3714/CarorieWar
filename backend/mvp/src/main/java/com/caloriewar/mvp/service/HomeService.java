package com.caloriewar.mvp.service;

import com.caloriewar.mvp.domain.UserGameStatus;
import com.caloriewar.mvp.dto.response.HomeResponse;
import com.caloriewar.mvp.dto.response.NearbyPlayerDto;
import com.caloriewar.mvp.repository.UserGameStatusRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HomeService {

    private static final double BASE_RADIUS = 5.0;
    private static final double SCALE_FACTOR = 0.05;

    private final UserGameStatusRepository userGameStatusRepository;

    public HomeService(UserGameStatusRepository userGameStatusRepository) {
        this.userGameStatusRepository = userGameStatusRepository;
    }

    @Transactional(readOnly = true)
    public HomeResponse getHome(Long userId) {
        List<NearbyPlayerDto> nearbyPlayers = userGameStatusRepository.findByIsWorkingTrue().stream()
                .filter(s -> userId == null || !s.getUserId().equals(userId))
                .map(s -> new NearbyPlayerDto(
                        s.getUser().getNickname(),
                        s.getStartLatitude(),
                        s.getStartLongitude(),
                        calculateRadius(s.getTotalScore()),
                        s.getTeamColor()
                ))
                .toList();

        if (userId == null) {
            return new HomeResponse(null, null, null, null, nearbyPlayers);
        }

        UserGameStatus mine = userGameStatusRepository.findById(userId).orElseThrow();

        return new HomeResponse(
                mine.getUser().getNickname(),
                mine.getTotalScore(),
                calculateRadius(mine.getTotalScore()),
                mine.getTeamColor(),
                nearbyPlayers
        );
    }

    private double calculateRadius(int score) {
        return BASE_RADIUS + score * SCALE_FACTOR;
    }
}