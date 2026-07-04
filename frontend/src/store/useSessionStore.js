import { create } from 'zustand';

const useSessionStore = create((set) => ({
  active: false,
  startedAt: null, // ms
  exercise: null, // { exerciseId, name, caloriesPerFiveMin }
  center: null, // 고정된 시작 좌표 { lat, lng }
  totalScore: 0,
  myRadius: 0,
  players: [],

  startSession: (exercise, center) =>
    set({
      active: true,
      startedAt: Date.now(),
      exercise,
      center,
      totalScore: exercise?.currentScore ?? 0,
      myRadius: 0,
      players: [],
    }),

  applyScore: ({ totalScore, myRadius, players }) =>
    set({ totalScore, myRadius, players }),

  endSession: () =>
    set({
      active: false,
      startedAt: null,
      exercise: null,
      center: null,
      totalScore: 0,
      myRadius: 0,
      players: [],
    }),
}));

export default useSessionStore;