package com.caloriewar.mvp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NearbyPlayerDto {
    private String nickname;
    private Double latitude;
    private Double longitude;
    private Integer score;   // /home 에서 사용
    private Double radius;   // /working/score 에서 사용
    private String teamColor;
}
