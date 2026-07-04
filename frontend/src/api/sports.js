import Client from './client';
import { AllExercises, ExerciseColors } from '../mocks/exercises';

// 백엔드 준비 전에는 true 로 두고 화면 개발, 연동 시 false
const USE_MOCK = false;

// 목업 전용 인메모리 상태 ( 새로고침하면 초기화됨 )
// isAdded 가 true 인 운동이 곧 내 운동 리스트
const MockState = {
  Added: AllExercises.filter((Ex) => Ex.isAdded).map((Ex) => ({ ...Ex, isSelected: false })),
};

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// GET /my-sports - 내 운동 리스트 조회
export async function getMySports() {
  if (USE_MOCK) {
    await delay();
    return MockState.Added.map((Ex) => ({ ...Ex }));
  }
  const { data } = await Client.get('/my-sports');
  return data.data;
}

// POST /my-sports - 지금 할 운동 선택
export async function selectSport(exerciseId) {
  if (USE_MOCK) {
    await delay();
    MockState.Added = MockState.Added.map((Ex) => ({
      ...Ex,
      isSelected: Ex.exerciseId === exerciseId,
    }));
    const Found = MockState.Added.find((Ex) => Ex.exerciseId === exerciseId);
    if (!Found) {
      const Err = new Error('운동을 먼저 선택해주세요.');
      Err.response = { data: { message: '운동을 먼저 선택해주세요.' } };
      throw Err;
    }
    return Found;
  }
  const { data } = await Client.post('/my-sports', { exerciseId });
  return data.data;
}

// GET /all-sports - 전체 운동 리스트 조회
export async function getAllSports() {
  if (USE_MOCK) {
    await delay();
    const AddedIds = new Set(MockState.Added.map((Ex) => Ex.exerciseId));
    return AllExercises.map((Ex) => ({ ...Ex, isAdded: AddedIds.has(Ex.exerciseId) }));
  }
  const { data } = await Client.get('/all-sports');
  return data.data;
}

// POST /all-sports - 내 운동에 추가
export async function addSport(exerciseId) {
  if (USE_MOCK) {
    await delay();
    const Already = MockState.Added.some((Ex) => Ex.exerciseId === exerciseId);
    if (Already) {
      const Err = new Error('이미 내 운동에 추가된 운동입니다');
      Err.response = { data: { message: '이미 내 운동에 추가된 운동입니다', code: 409 } };
      throw Err;
    }
    const Target = AllExercises.find((Ex) => Ex.exerciseId === exerciseId);
    if (!Target) {
      const Err = new Error('존재하지 않는 운동입니다');
      Err.response = { data: { message: '존재하지 않는 운동입니다', code: 404 } };
      throw Err;
    }
    MockState.Added.push({ ...Target, isAdded: true, isSelected: false });
    return { ...Target, isAdded: true };
  }
  const { data } = await Client.post('/all-sports', { exerciseId });
  return data.data;
}

// 운동 색상 헬퍼 ( 목업 표시용, 서버 연동 시 무관 )
export function colorOf(exerciseId) {
  return ExerciseColors[exerciseId] ?? '#888888';
}