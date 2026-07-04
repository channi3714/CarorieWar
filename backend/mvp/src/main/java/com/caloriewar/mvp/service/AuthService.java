package com.caloriewar.mvp.service;

import com.caloriewar.mvp.domain.User;
import com.caloriewar.mvp.domain.UserGameStatus;
import com.caloriewar.mvp.dto.request.LoginRequest;
import com.caloriewar.mvp.dto.response.AuthResponse;
import com.caloriewar.mvp.exception.AuthException;
import com.caloriewar.mvp.repository.UserGameStatusRepository;
import com.caloriewar.mvp.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private static final String[] COLORS = {
        "#FF5733", "#3399FF", "#33FF99", "#FF33CC",
        "#FFD700", "#9933FF", "#FF6600", "#00CCFF"
    };

    private final UserRepository userRepository;
    private final UserGameStatusRepository userGameStatusRepository;

    public AuthService(UserRepository userRepository, UserGameStatusRepository userGameStatusRepository) {
        this.userRepository = userRepository;
        this.userGameStatusRepository = userGameStatusRepository;
    }

    @Transactional
    public AuthResponse login(LoginRequest request, HttpSession session) {
        Optional<User> found = userRepository.findByNickname(request.getNickname());

        User user;
        if (found.isPresent()) {
            user = found.get();
            if (!user.getPassword().equals(request.getPassword())) {
                throw new AuthException("비밀번호가 일치하지 않습니다.");
            }
        } else {
            user = new User();
            user.setNickname(request.getNickname());
            user.setPassword(request.getPassword());
            userRepository.save(user);

            String color = COLORS[(int) (userRepository.count() % COLORS.length)];
            UserGameStatus gameStatus = new UserGameStatus();
            gameStatus.setUser(user);
            gameStatus.setTotalScore(0);
            gameStatus.setTeamColor(color);
            userGameStatusRepository.save(gameStatus);
        }

        session.setAttribute("userId", user.getId());
        return new AuthResponse(user.getId(), user.getNickname());
    }
}
