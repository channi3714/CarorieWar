package com.caloriewar.mvp.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NearbyPlayerDto {
    private String nickname;
    private Double latitude;
    private Double longitude;
    private Integer score;      // /home 에서 사용
    private Double radius;      // /working/score 에서 사용
    private String teamColor;
    private Long exerciseId;
    private String exercise;    // 운동 이름 (프론트 라벨용)
}
