package com.caloriewar.mvp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NearbyPlayerDto {
    private String nickname;
    private Double latitude;
    private Double longitude;
    private Integer score;
    private String teamColor;
}
