// 밀리초 -> "H:MM:SS" ( padHours 옵션 시 "HH:MM:SS" )
export function formatDuration(ms, { padHours = false } = {}) {
  const Total = Math.max(0, Math.floor(ms / 1000));
  const H = Math.floor(Total / 3600);
  const M = Math.floor((Total % 3600) / 60);
  const S = Total % 60;
  const HH = padHours ? String(H).padStart(2, '0') : String(H);
  return `${HH}:${String(M).padStart(2, '0')}:${String(S).padStart(2, '0')}`;
}

// 밀리초 -> "M분 S초"
export function formatDurationKo(ms) {
  const Total = Math.max(0, Math.floor(ms / 1000));
  const M = Math.floor(Total / 60);
  const S = Total % 60;
  return `${M}분 ${S}초`;
}

// 타임스탬프 -> "오후 3:24" ( 기록 목록 표시용 )
export function formatClock(ts) {
  return new Date(ts).toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });
}
