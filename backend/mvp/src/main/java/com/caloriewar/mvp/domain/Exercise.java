package com.caloriewar.mvp.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "exercises")
@Getter @Setter
@NoArgsConstructor
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "calories_per_five_min", nullable = false)
    private Integer caloriesPerFiveMin; // 타입 Long 원하셨으니 개별 튜닝 시 Long으로 써도 무방합니다. 여기선 일단 스키마대로 INT 매핑을 위해 Integer 사용
}
