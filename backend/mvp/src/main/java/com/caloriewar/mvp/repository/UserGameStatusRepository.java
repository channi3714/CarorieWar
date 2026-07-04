package com.caloriewar.mvp.repository;

import com.caloriewar.mvp.domain.UserGameStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserGameStatusRepository extends JpaRepository<UserGameStatus, Long> {
}
