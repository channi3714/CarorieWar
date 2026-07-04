package com.caloriewar.mvp.repository;

import com.caloriewar.mvp.domain.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

}
