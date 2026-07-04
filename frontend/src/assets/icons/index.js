// 운동 아이콘 매핑 ( exerciseId 기준, ?url 로 번들 URL 확보 )
import running from './running.svg?url';
import swimming from './swimming.svg?url';
import cycling from './cycling.svg?url';
import pilates from './pilates.svg?url';
import training from './training.svg?url';

// 1=트레이닝, 3=수영, 4=필라테스, 5=러닝, 6=자전거
const IconById = {
  1: training,
  3: swimming,
  4: pilates,
  5: running,
  6: cycling,
};

export function iconOf(exerciseId) {
  return IconById[exerciseId] ?? training;
}