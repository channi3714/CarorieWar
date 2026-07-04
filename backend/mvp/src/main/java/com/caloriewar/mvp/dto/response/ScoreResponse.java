package com.caloriewar.mvp.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ScoreResponse {
    private Integer totalScore;
    private List<NearbyPlayerDto> nearbyPlayers;
    private String eventType;
    private String eventOpponentNickname;
}
