package com.caloriewar.mvp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WorkingInfoResponse {
    private Long exerciseId;
    private String name;
    private Integer currentScore;
    private Integer caloriesPerFiveMin;
}
