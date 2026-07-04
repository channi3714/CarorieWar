package com.caloriewar.mvp.service;

import com.caloriewar.mvp.domain.Exercise;
import com.caloriewar.mvp.domain.User;
import com.caloriewar.mvp.domain.UserExercise;
import com.caloriewar.mvp.domain.UserGameStatus;
import com.caloriewar.mvp.dto.request.AddExerciseRequest;
import com.caloriewar.mvp.dto.request.SelectExerciseRequest;
import com.caloriewar.mvp.dto.response.SportResponse;
import com.caloriewar.mvp.exception.ConflictException;
import com.caloriewar.mvp.exception.NotFoundException;
import com.caloriewar.mvp.repository.ExerciseRepository;
import com.caloriewar.mvp.repository.UserExerciseRepository;
import com.caloriewar.mvp.repository.UserGameStatusRepository;
import com.caloriewar.mvp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExerciseService {

    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserExerciseRepository userExerciseRepository;
    private final UserGameStatusRepository userGameStatusRepository;

    public ExerciseService(UserRepository userRepository,
                           ExerciseRepository exerciseRepository,
                           UserExerciseRepository userExerciseRepository,
                           UserGameStatusRepository userGameStatusRepository) {
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
        this.userExerciseRepository = userExerciseRepository;
        this.userGameStatusRepository = userGameStatusRepository;
    }

    @Transactional(readOnly = true)
    public List<SportResponse> getMySports(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return userExerciseRepository.findByUser(user).stream()
            .map(ue -> new SportResponse(
                ue.getExercise().getId(),
                ue.getExercise().getName(),
                ue.getExercise().getCaloriesPerFiveMin(),
                ue.getIsSelected(),
                null
            ))
            .toList();
    }

    @Transactional
    public void selectExercise(Long userId, SelectExerciseRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        Exercise exercise = exerciseRepository.findById(request.getExerciseId())
            .orElseThrow(() -> new NotFoundException("해당 운동이 내 리스트에 없습니다."));

        List<UserExercise> myExercises = userExerciseRepository.findByUser(user);

        boolean found = false;
        for (UserExercise ue : myExercises) {
            if (ue.getExercise().getId().equals(request.getExerciseId())) {
                ue.setIsSelected(true);
                found = true;
            } else {
                ue.setIsSelected(false);
            }
        }
        if (!found) {
            throw new NotFoundException("해당 운동이 내 리스트에 없습니다.");
        }
        userExerciseRepository.saveAll(myExercises);

        UserGameStatus status = userGameStatusRepository.findById(userId).orElseThrow();
        status.setCurrentExercise(exercise);
        userGameStatusRepository.save(status);
    }

    @Transactional(readOnly = true)
    public List<SportResponse> getAllSports(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<UserExercise> myExercises = userExerciseRepository.findByUser(user);

        return exerciseRepository.findAll().stream()
            .map(ex -> {
                boolean isAdded = myExercises.stream()
                    .anyMatch(ue -> ue.getExercise().getId().equals(ex.getId()));
                return new SportResponse(ex.getId(), ex.getName(), ex.getCaloriesPerFiveMin(), null, isAdded);
            })
            .toList();
    }

    @Transactional
    public void addExercise(Long userId, AddExerciseRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        Exercise exercise = exerciseRepository.findById(request.getExerciseId())
            .orElseThrow(() -> new NotFoundException("존재하지 않는 운동입니다."));

        if (userExerciseRepository.findByUserAndExercise(user, exercise).isPresent()) {
            throw new ConflictException("이미 추가된 운동입니다.");
        }

        UserExercise ue = new UserExercise();
        ue.setUser(user);
        ue.setExercise(exercise);
        ue.setIsSelected(false);
        userExerciseRepository.save(ue);
    }

    @Transactional
    public void deleteExercise(Long userId, Long exerciseId) {
        User user = userRepository.findById(userId).orElseThrow();
        Exercise exercise = exerciseRepository.findById(exerciseId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 운동입니다."));

        UserExercise ue = userExerciseRepository.findByUserAndExercise(user, exercise)
            .orElseThrow(() -> new NotFoundException("내 리스트에 없는 운동입니다."));

        // 삭제하는 운동이 현재 선택된 운동이면 GameStatus도 초기화
        if (Boolean.TRUE.equals(ue.getIsSelected())) {
            UserGameStatus status = userGameStatusRepository.findById(userId).orElseThrow();
            status.setCurrentExercise(null);
            userGameStatusRepository.save(status);
        }

        userExerciseRepository.delete(ue);
    }
}
