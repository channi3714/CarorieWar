package com.caloriewar.mvp;
import com.caloriewar.mvp.domain.Exercise;
import com.caloriewar.mvp.domain.User;
import com.caloriewar.mvp.domain.UserGameStatus;
import com.caloriewar.mvp.repository.ExerciseRepository;
import com.caloriewar.mvp.repository.UserGameStatusRepository;
import com.caloriewar.mvp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;
    private final UserGameStatusRepository userGameStatusRepository;

    public DataInitializer(ExerciseRepository exerciseRepository,
                           UserRepository userRepository,
                           UserGameStatusRepository userGameStatusRepository) {
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
        this.userGameStatusRepository = userGameStatusRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // [방어 코드] 상위 ddl-auto가 create가 아닐 때를 대비해 중복 실행 방지
        if (exerciseRepository.count() > 0) {
            System.out.println("====== 이미 시드 데이터가 존재하므로 초기화를 건너뜁니다 ======");
            return;
        }

        // 1. 새 ERD 스키마 요구사항 반영 운동 6종 세팅
        Exercise walk = createExercise("제자리걸음", 30);
        Exercise squat = createExercise("스쿼트", 50);
        Exercise swim = createExercise("수영", 60);
        Exercise pilates = createExercise("필라테스", 40);
        Exercise running = createExercise("러닝", 70);
        Exercise cycling = createExercise("자전거", 55);

        // 2. 1번 사용자(Users 테이블) 생성
        User mockUser = new User();
        mockUser.setName("오창엽");
        mockUser.setNickname("칼로리요정");
        mockUser.setPassword("password123!"); // 가짜 로그인 식별용 비번
        mockUser.setEmail("test@test.com");
        userRepository.save(mockUser);

        // 3. 🔥 핵심 변경 사항: 1번 사용자의 실시간 게임 상태(UserGameStatus) 생성
        UserGameStatus gameStatus = new UserGameStatus();
        gameStatus.setUser(mockUser);              // User 객체와 1:1 매핑 연결 (PK가 자동으로 mockUser의 id와 같아짐)
        gameStatus.setTotalScore(0);               // 초기 점수 0
        gameStatus.setTeamColor("#FF5733");         // 기본 팀 컬러
        gameStatus.setCurrentExercise(null);       // ◀️ 대기 상태이므로 실시간 운동은 null!
        gameStatus.setIsWorking(false);            // 운동 중 아님
        gameStatus.setStartLatitude(37.555);       // 해커톤 행사장 위도 디폴트
        gameStatus.setStartLongitude(126.937);     // 해커톤 행사장 경도 디폴트
        userGameStatusRepository.save(gameStatus);

        System.out.println("====== 새 ERD 기준 1:1 매핑 시드 데이터 로딩 완벽 성공 ======");
    }

    // 운동 생성을 간결하게 도와주는 헬퍼 메서드
    private Exercise createExercise(String name, int calories) {
        Exercise exercise = new Exercise();
        exercise.setName(name);
        exercise.setCaloriesPerFiveMin(calories);
        return exerciseRepository.save(exercise);
    }
}