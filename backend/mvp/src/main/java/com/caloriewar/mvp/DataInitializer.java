package com.caloriewar.mvp;

import com.caloriewar.mvp.domain.Exercise;
import com.caloriewar.mvp.domain.User;
import com.caloriewar.mvp.domain.UserExercise;
import com.caloriewar.mvp.domain.UserGameStatus;
import com.caloriewar.mvp.repository.ExerciseRepository;
import com.caloriewar.mvp.repository.UserExerciseRepository;
import com.caloriewar.mvp.repository.UserGameStatusRepository;
import com.caloriewar.mvp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;
    private final UserGameStatusRepository userGameStatusRepository;
    private final UserExerciseRepository userExerciseRepository;

    public DataInitializer(ExerciseRepository exerciseRepository,
                           UserRepository userRepository,
                           UserGameStatusRepository userGameStatusRepository,
                           UserExerciseRepository userExerciseRepository) {
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
        this.userGameStatusRepository = userGameStatusRepository;
        this.userExerciseRepository = userExerciseRepository;
    }

    @Override
    public void run(String... args) {
        if (exerciseRepository.count() > 0) {
            System.out.println("====== 이미 시드 데이터가 존재하므로 초기화를 건너뜁니다 ======");
            return;
        }

        // 운동 6종
        Exercise walk = createExercise("제자리걸음", 30);
        Exercise squat = createExercise("스쿼트", 50);
        Exercise swim = createExercise("수영", 60);
        Exercise pilates = createExercise("필라테스", 40);
        Exercise running = createExercise("러닝", 70);
        Exercise cycling = createExercise("자전거", 55);

        // 기준 유저 (서강대학교 인근)
        User mockUser = createUser("칼로리요정", "password123!");
        UserGameStatus mockStatus = createGameStatus(mockUser, 0, "#FF5733", false, 37.555, 126.937, null);
        addUserExercise(mockUser, squat, false);
        addUserExercise(mockUser, walk, false);

        // 더미 유저들 — isWorking=true, 운동 중 상태로 세팅
        // 각각 기준 유저로부터 다른 거리에 배치
        User dummy1 = createUser("불꽃전사", "pw1");
        // 약 140m 북동 (기준 원과 겹칠 수 있는 가까운 거리)
        createGameStatus(dummy1, 200, "#3399FF", true, 37.5563, 126.9383, squat);
        addUserExercise(dummy1, squat, true);

        User dummy2 = createUser("근육왕", "pw2");
        // 약 200m 남서
        createGameStatus(dummy2, 150, "#33FF99", true, 37.5535, 126.9353, running);
        addUserExercise(dummy2, running, true);

        User dummy3 = createUser("다이어트퀸", "pw3");
        // 약 350m 북서
        createGameStatus(dummy3, 80, "#FF33CC", true, 37.5582, 126.9342, walk);
        addUserExercise(dummy3, walk, true);

        User dummy4 = createUser("칼로리파괴자", "pw4");
        // 약 500m 동쪽
        createGameStatus(dummy4, 300, "#FFD700", true, 37.5551, 126.9415, cycling);
        addUserExercise(dummy4, cycling, true);

        User dummy5 = createUser("운동천재", "pw5");
        // 약 700m 남쪽
        createGameStatus(dummy5, 500, "#9933FF", true, 37.5487, 126.9371, pilates);
        addUserExercise(dummy5, pilates, true);

        System.out.println("====== 시드 데이터 초기화 완료 (기준 유저 1명 + 더미 유저 5명) ======");
    }

    private Exercise createExercise(String name, int calories) {
        Exercise e = new Exercise();
        e.setName(name);
        e.setCaloriesPerFiveMin(calories);
        return exerciseRepository.save(e);
    }

    private User createUser(String nickname, String password) {
        User u = new User();
        u.setNickname(nickname);
        u.setPassword(password);
        return userRepository.save(u);
    }

    private UserGameStatus createGameStatus(User user, int score, String color,
                                            boolean isWorking, double lat, double lng,
                                            Exercise currentExercise) {
        UserGameStatus s = new UserGameStatus();
        s.setUser(user);
        s.setTotalScore(score);
        s.setTeamColor(color);
        s.setIsWorking(isWorking);
        s.setStartLatitude(lat);
        s.setStartLongitude(lng);
        s.setCurrentExercise(currentExercise);
        return userGameStatusRepository.save(s);
    }

    private void addUserExercise(User user, Exercise exercise, boolean isSelected) {
        UserExercise ue = new UserExercise();
        ue.setUser(user);
        ue.setExercise(exercise);
        ue.setIsSelected(isSelected);
        userExerciseRepository.save(ue);
    }
}
