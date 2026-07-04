package com.caloriewar.mvp.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SportResponse {
    private Long exerciseId;
    private String name;
    private Integer caloriesPerFiveMin;
    private Boolean isSelected;  // /my-sports 전용
    private Boolean isAdded;     // /all-sports 전용
}
