import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 로컬 날짜 키 ( YYYY-MM-DD ) - '오늘' 판정용
export function dayKeyOf(ts = Date.now()) {
  const D = new Date(ts);
  const Y = D.getFullYear();
  const M = String(D.getMonth() + 1).padStart(2, '0');
  const Day = String(D.getDate()).padStart(2, '0');
  return `${Y}-${M}-${Day}`;
}

// --- 파생 조회 헬퍼 ( records 배열을 받는 순수 함수, 컴포넌트에서 useMemo 로 사용 ) ---

// 오늘 총 운동 시간(ms)
export function todayTotalMs(records) {
  const Today = dayKeyOf();
  return records.reduce((Sum, R) => (R.dayKey === Today ? Sum + R.durationMs : Sum), 0);
}

// 오늘 특정 운동 누적 시간(ms)
export function todayExerciseMs(records, exerciseId) {
  const Today = dayKeyOf();
  return records.reduce(
    (Sum, R) => (R.dayKey === Today && R.exerciseId === exerciseId ? Sum + R.durationMs : Sum),
    0
  );
}

// 운동 시간 기록 저장소 ( localStorage 영속 - 새로고침해도 유지 )
const useWorkStore = create(
  persist(
    (set) => ({
      // { id, exerciseId, name, durationMs, calories, finishedAt, dayKey }
      records: [],

      // 운동 종료 시 경과 시간 저장
      addRecord: ({ exerciseId, name, durationMs, calories = 0 }) => {
        // 유효하지 않거나 1초 미만이면 저장하지 않음
        if (!exerciseId || !durationMs || durationMs < 1000) return;
        const FinishedAt = Date.now();
        const Record = {
          id: `${FinishedAt}-${exerciseId}`,
          exerciseId,
          name: name ?? '',
          durationMs,
          calories,
          finishedAt: FinishedAt,
          dayKey: dayKeyOf(FinishedAt),
        };
        set((State) => ({ records: [Record, ...State.records] }));
      },

      // 전체 기록 삭제
      clearRecords: () => set({ records: [] }),
    }),
    {
      name: 'cw-work-records', // localStorage 키
      version: 1,
    }
  )
);

export default useWorkStore;
