// 운동별 색상 ( 프로토타입 톤 유지, 목업 표시용 )
export const ExerciseColors = {
  1: '#F5A623', // 트레이닝
  3: '#2979E1', // 수영
  4: '#9013FE', // 필라테스
  5: '#E1272E', // 러닝
  6: '#00897B', // 자전거
};

// 전체 운동 마스터 ( GET /all-sports 응답 형태 )
export const AllExercises = [
  { exerciseId: 1, name: '트레이닝', caloriesPerFiveMin: 50, isAdded: true },
  { exerciseId: 3, name: '수영', caloriesPerFiveMin: 60, isAdded: false },
  { exerciseId: 4, name: '필라테스', caloriesPerFiveMin: 40, isAdded: false },
  { exerciseId: 5, name: '러닝', caloriesPerFiveMin: 70, isAdded: false },
  { exerciseId: 6, name: '자전거', caloriesPerFiveMin: 55, isAdded: false },
];