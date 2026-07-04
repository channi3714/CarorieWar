package com.caloriewar.mvp.repository;

import com.caloriewar.mvp.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
