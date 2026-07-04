import Client from './client';
import { colorOf } from './sports';
import { iconOf } from '../assets/icons';

// 백엔드 준비 전에는 true, 연동 시 false
const USE_MOCK = false;

// 목업 세션 상태 ( score 폴링마다 점수 · 반지름 증가 )
const MockSession = {
  exerciseId: 1,
  name: '트레이닝',
  caloriesPerFiveMin: 50,
  totalScore: 0,
  myRadius: 120,
};

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 목업 주변 플레이어 ( 내 시작 좌표 기준 가깝게, 데모용 큰 반지름 )
function mockNearby(myLat = 37.5559, myLng = 126.9368) {
  return [
    { nickname: '수영왕', latitude: myLat + 0.0022, longitude: myLng - 0.0026, radius: 180, teamColor: '#E1272E', icon: iconOf(3), exercise: '수영' },
    { nickname: '러닝왕', latitude: myLat + 0.0030, longitude: myLng + 0.0005, radius: 260, teamColor: '#F5A623', icon: iconOf(5), exercise: '러닝' },
    { nickname: '자전거왕', latitude: myLat + 0.0008, longitude: myLng + 0.0030, radius: 90, teamColor: '#9013FE', icon: iconOf(6), exercise: '자전거' },
  ];
}

// GET /working - 운동 화면 진입 정보
export async function getWorking() {
  if (USE_MOCK) {
    await delay();
    return {
      exerciseId: MockSession.exerciseId,
      name: MockSession.name,
      currentScore: MockSession.totalScore,
      caloriesPerFiveMin: MockSession.caloriesPerFiveMin,
    };
  }
  const { data } = await Client.get('/working');
  return data.data;
}

// POST /working/start - 시작 위치 원 중심 고정
export async function startWorking(latitude, longitude) {
  if (USE_MOCK) {
    await delay();
    return { latitude, longitude };
  }
  const { data } = await Client.post('/working/start', { latitude, longitude });
  return data.data;
}

// POST /working/score - 주기 점수 적립 · 정복 판정
export async function postScore() {
  if (USE_MOCK) {
    await delay();
    MockSession.totalScore += 40; // 호출마다 점수
    MockSession.myRadius += 15; // 반지름 빠르게 증가
    return {
      totalScore: MockSession.totalScore,
      myRadius: Number(MockSession.myRadius.toFixed(1)),
      nearbyPlayers: mockNearby(),
      eventType: null,
      eventOpponentNickname: null,
    };
  }
  const { data } = await Client.get('/working/score');
  return data.data;
}

// POST /working - 운동 종료 결과 전송 ( 요약 화면 확정 전까지 최소 형태 )
export async function finishWorking(payload) {
  if (USE_MOCK) {
    await delay();
    return { ...payload, saved: true };
  }
  const { data } = await Client.post('/working/stop');
  return data.data;
}

export { colorOf };