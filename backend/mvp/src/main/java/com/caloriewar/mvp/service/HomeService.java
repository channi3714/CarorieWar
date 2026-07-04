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

    private final UserGameStatusRepository userGameStatusRepository;

    public HomeService(UserGameStatusRepository userGameStatusRepository) {
        this.userGameStatusRepository = userGameStatusRepository;
    }

    @Transactional(readOnly = true)
    public HomeResponse getHome(Long userId) {
        UserGameStatus mine = userGameStatusRepository.findById(userId).orElseThrow();

        List<NearbyPlayerDto> nearbyPlayers = userGameStatusRepository.findByIsWorkingTrue().stream()
            .filter(s -> !s.getUserId().equals(userId))
            .map(s -> new NearbyPlayerDto(
                s.getUser().getNickname(),
                s.getStartLatitude(),
                s.getStartLongitude(),
                s.getTotalScore(),
                s.getTeamColor()
            ))
            .toList();

        return new HomeResponse(
            mine.getUser().getNickname(),
            mine.getTotalScore(),
            mine.getTeamColor(),
            nearbyPlayers
        );
    }
}
