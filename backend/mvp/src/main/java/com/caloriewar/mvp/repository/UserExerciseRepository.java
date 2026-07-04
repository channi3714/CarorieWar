package com.caloriewar.mvp.repository;

import com.caloriewar.mvp.domain.Exercise;
import com.caloriewar.mvp.domain.User;
import com.caloriewar.mvp.domain.UserExercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserExerciseRepository extends JpaRepository<UserExercise, Long> {
    List<UserExercise> findByUser(User user);
    Optional<UserExercise> findByUserAndExercise(User user, Exercise exercise);
    Optional<UserExercise> findByUserAndIsSelectedTrue(User user);
}
