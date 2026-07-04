package com.caloriewar.mvp.repository;

import com.caloriewar.mvp.domain.UserGameStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserGameStatusRepository extends JpaRepository<UserGameStatus, Long> {
    List<UserGameStatus> findByIsWorkingTrue();
}
