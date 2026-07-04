package com.caloriewar.mvp.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class StartWorkingRequest {
    private Double latitude;
    private Double longitude;
}
