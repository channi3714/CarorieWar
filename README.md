# 🔥 Calorie NyamNyam

> 운동으로 칼로리를 태워 지도 위 내 영역을 넓히고, 근처 플레이어를 정복하는 **위치 기반 실시간 땅따먹기 게임**

운동을 시작하면 현재 위치에 내 팀 색깔의 원(영역)이 생깁니다. 운동을 지속할수록 칼로리 점수가 쌓이고, 점수만큼 원의 반지름이 커집니다. 내 원이 근처 다른 플레이어의 원을 덮으면 그 플레이어를 **정복**해 상대의 영역을 내 팀 색으로 물들입니다. 반대로 더 큰 상대에게 정복당할 수도 있습니다.

---

## 🎮 게임 규칙

- **영역 반지름** = `5 + (누적 점수 × 0.05)` (미터)
- **점수 적립**: 운동 중이면 3초마다 자동 적립하며, 적립량은 운동 종류의 칼로리 소모량(`5분당 kcal ÷ 5`)에 비례합니다.
- **충돌 판정**: 두 플레이어 사이 거리와 각자의 반지름을 비교
  - **정복(CONQUERED)**: 내 원이 상대를 덮고 내 반지름이 더 큼 → 상대가 내 팀 색으로 변경
  - **피정복(CONQUERED_BY_OPPONENT)**: 더 큰 상대에게 덮임 → 내가 상대 팀 색으로 변경
  - **조우(MEETING)**: 두 원이 겹치지만 어느 쪽도 완전히 덮지 못함
- **운동 종류**: 제자리걸음 · 스쿼트 · 수영 · 필라테스 · 러닝 · 자전거 (각기 다른 칼로리 소모량)

---

## 🏗️ 기술 스택

### Frontend
- **React 19** + **Vite 8**
- **React Router 7** — 라우팅
- **Zustand** — 전역 상태 관리 (인증 / 세션 / 운동)
- **styled-components** — 스타일링
- **Leaflet / react-leaflet** + **Kakao Map** — 지도 및 영역 시각화
- **axios** — API 통신 (세션 쿠키 기반 인증)

### Backend
- **Spring Boot 4.1** + **Java 21**
- **Spring Data JPA** — ORM
- **H2 Database** — 파일 기반 내장 DB (데모용)
- **HttpSession** — 세션 기반 인증 (JWT 미사용)
- **Spring Scheduler** — 3초마다 전체 유저 점수 적립 및 충돌 감지

---

## 📁 프로젝트 구조

```
CarorieWar/
├── frontend/
│   └── src/
│       ├── api/            # axios 클라이언트 & API 모듈
│       ├── components/     # 공통 · 지도(map) · 운동(work) 컴포넌트
│       ├── pages/          # Login, Home, WorkAdd, Working, Ranking, MyPage
│       ├── store/          # Zustand 스토어 (auth, session, work)
│       ├── hooks/          # useGeolocation, useKakaoLoader, useTimer
│       ├── constants/      # 라우트 상수
│       └── utils/          # calorie, format 유틸
│
└── backend/mvp/
    └── src/main/java/com/caloriewar/mvp/
        ├── controller/     # AuthController, HomeController, WorkingController, ExerciseController
        ├── service/        # AuthService, HomeService, WorkingService, ExerciseService, ScoreScheduler
        ├── domain/         # User, UserGameStatus, UserExercise, Exercise
        ├── repository/     # Spring Data JPA 레포지토리
        ├── dto/            # 요청/응답 DTO
        ├── exception/      # GlobalExceptionHandler, 커스텀 예외
        ├── config/         # CORS 설정
        └── DataInitializer.java  # 서버 시작 시 더미 데이터 자동 세팅
```

---

## 🚀 실행 방법

### 사전 요구사항
- Node.js 18+
- JDK 21+

### 백엔드 실행

```bash
cd backend/mvp
./gradlew bootRun        # Mac/Linux
gradlew.bat bootRun      # Windows
```

- API 서버: `http://localhost:8080`
- H2 콘솔: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:file:./calorie_db`
  - username: `cw` / password: `cw00`
- 서버 시작 시 더미 유저 5명이 자동으로 생성됩니다.

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

- 개발 서버: `http://localhost:5173`
- API 서버 주소는 `.env`의 `VITE_API_BASE_URL`로 지정합니다. (`http://localhost:8080`)

### 백엔드 데이터 초기화

```bash
# backend/mvp 폴더에서 DB 파일 삭제 후 서버 재시작
rm -f calorie_db.mv.db calorie_db.trace.db
./gradlew bootRun
```

---

## 📡 주요 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/auth/login` | 로그인 (닉네임+비밀번호, 없으면 자동 가입) |
| GET | `/home` | 홈 화면 — 내 정보 + 주변 운동 중인 플레이어 |
| GET | `/working` | 운동 화면 진입 정보 (선택된 운동 확인) |
| POST | `/working/start` | 운동 시작 위치 고정 |
| GET | `/working/score` | 점수 폴링 — 충돌 판정 및 이벤트 응답 |
| POST | `/working/stop` | 운동 종료 |
| GET | `/my-sports` | 내 운동 목록 조회 |
| POST | `/my-sports/select` | 운동 선택 |
| DELETE | `/my-sports/{exerciseId}` | 내 운동 목록에서 삭제 |
| GET | `/sports` | 전체 운동 종목 조회 |
| POST | `/sports` | 운동 종목 추가 |

---
