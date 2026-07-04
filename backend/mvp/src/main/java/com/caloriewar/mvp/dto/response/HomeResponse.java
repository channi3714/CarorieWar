package com.caloriewar.mvp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class HomeResponse {
    private String nickname;
    private Integer totalScore;
    private Double myRadius;
    private String teamColor;
    private List<NearbyPlayerDto> nearbyPlayers;
}
