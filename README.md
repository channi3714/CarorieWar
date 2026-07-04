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

- **React 19** + **Vite 8**
- **React Router 7** — 라우팅
- **Zustand** — 전역 상태 관리 (인증 / 세션 / 운동)
- **styled-components** — 스타일링
- **Leaflet / react-leaflet** + **Kakao Map** — 지도 및 영역 시각화
- **axios** — API 통신 (세션 쿠키 기반 인증)

---

## 📁 프로젝트 구조

```
frontend/
└── src/
    ├── api/                 # axios 클라이언트 & API 모듈
    ├── components/          # 공통 · 지도(map) · 운동(work) 컴포넌트
    ├── pages/               # Login, Home, WorkAdd, Working, Ranking, MyPage
    ├── store/               # Zustand 스토어 (auth, session, work)
    ├── hooks/               # useGeolocation, useKakaoLoader, useTimer
    ├── constants/           # 라우트 상수
    └── utils/               # calorie, format 유틸
```

---

## 🚀 실행 방법

### 사전 요구사항
- Node.js 18+

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

- 개발 서버: `http://localhost:5173`
- API 서버 주소는 [vite.config.js](frontend/vite.config.js)의 프록시(`/api`) 설정 또는 `.env`의 `VITE_API_BASE_URL`로 지정합니다.

---

## 📝 참고

- 인증은 세션 쿠키(`withCredentials`)로 처리됩니다.
- 이 프로젝트는 해커톤(복커톤) 출품작으로, MVP 시연에 초점이 맞춰져 있습니다.
