import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaPlay } from 'react-icons/fa';
import { getMySports, selectSport, colorOf } from '../../api/sports';
import useWorkStore, { todayTotalMs, todayExerciseMs } from '../../store/useWorkStore';
import { formatDuration, formatDurationKo, formatClock } from '../../utils/format';
import { ROUTES } from '../../constants/routes';

function WorkList() {
  const navigate = useNavigate();

  const [MySports, setMySports] = useState([]);
  const [tab, setTab] = useState('timer');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startingId, setStartingId] = useState(null);

  // 저장된 운동 시간 기록
  const records = useWorkStore((s) => s.records);
  const totalMs = useMemo(() => todayTotalMs(records), [records]);
  // 오늘 운동별 누적 시간 맵 { [exerciseId]: ms }
  const perExerciseMs = useMemo(() => {
    const Map = {};
    MySports.forEach((Ex) => {
      Map[Ex.exerciseId] = todayExerciseMs(records, Ex.exerciseId);
    });
    return Map;
  }, [records, MySports]);

  useEffect(() => {
    let Alive = true;
    (async () => {
      try {
        const List = await getMySports();
        if (Alive) setMySports(List);
      } catch {
        if (Alive) setError('운동 목록을 불러오지 못했습니다');
      } finally {
        if (Alive) setLoading(false);
      }
    })();
    return () => {
      Alive = false;
    };
  }, []);

  // 색깔 동그라미 = 시작 버튼 : 해당 운동으로 선택 확정 후 바로 이동
  const handleStart = async (exerciseId) => {
    if (startingId != null) return;
    setStartingId(exerciseId);
    setError('');
    try {
      await selectSport(exerciseId);
      navigate(ROUTES.WORKING);
    } catch (err) {
      setError(err.response?.data?.message ?? '운동 시작에 실패했습니다');
      setStartingId(null);
    }
  };

  return (
    <Page>
      <Header>
        <SectionLabel>오늘의 운동</SectionLabel>
        <AddButton onClick={() => navigate(ROUTES.WORK_ADD)}>
          <FaPlus size={11} />
          운동 추가하기
        </AddButton>
      </Header>

      <TotalTimer>{formatDuration(totalMs)}</TotalTimer>
      <TotalSub>{formatDurationKo(totalMs)}</TotalSub>

      <Tabs>
        <Tab $active={tab === 'timer'} onClick={() => setTab('timer')}>
          타이머
        </Tab>
        <Tab $active={tab === 'record'} onClick={() => setTab('record')}>
          나의 기록
        </Tab>
      </Tabs>

      <List>
        {loading && <Empty>불러오는 중...</Empty>}
        {!loading && error && <Empty>{error}</Empty>}
        {!loading && !error && MySports.length === 0 && (
          <Empty>추가된 운동이 없습니다. 우측 상단에서 추가해보세요</Empty>
        )}

        {!loading &&
          tab === 'timer' &&
          MySports.map((Ex) => (
            <Item key={Ex.exerciseId}>
              <StartDot
                style={{ background: colorOf(Ex.exerciseId) }}
                onClick={() => handleStart(Ex.exerciseId)}
                disabled={startingId != null}
                aria-label={`${Ex.name} 시작`}
              >
                <FaPlay size={13} />
              </StartDot>
              <Info>
                <Name>{Ex.name}</Name>
                <Meta>5분 · {Ex.caloriesPerFiveMin} kcal</Meta>
              </Info>
              <Time>{formatDuration(perExerciseMs[Ex.exerciseId] ?? 0, { padHours: true })}</Time>
            </Item>
          ))}

        {!loading && tab === 'record' && records.length === 0 && (
          <Empty>아직 기록이 없습니다</Empty>
        )}

        {!loading &&
          tab === 'record' &&
          records.map((R) => (
            <RecordItem key={R.id}>
              <Dot style={{ background: colorOf(R.exerciseId) }} />
              <Info>
                <Name>{R.name}</Name>
                <Meta>
                  {formatClock(R.finishedAt)} · {R.calories} kcal
                </Meta>
              </Info>
              <Time>{formatDuration(R.durationMs, { padHours: true })}</Time>
            </RecordItem>
          ))}
      </List>
    </Page>
  );
}

export default WorkList;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
`;

const List = styled.div`
  padding: 8px 20px 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 8px;
`;

const SectionLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSub};
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 600;
`;

const TotalTimer = styled.div`
  text-align: center;
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -1px;
  margin-top: 8px;
`;

const TotalSub = styled.div`
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSub};
  margin-top: 2px;
`;

const Tabs = styled.div`
  display: flex;
  margin: 20px 20px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.textSub)};
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 4px;
`;

// 기록 탭 항목 ( 시작 버튼 없이 색상 점만 표시 )
const RecordItem = styled(Item)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Dot = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
`;

// 색깔 동그라미 자체가 시작 버튼
const StartDot = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.92);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Info = styled.div`
  flex: 1;
`;

const Name = styled.div`
  font-size: 15px;
  font-weight: 700;
`;

const Meta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSub};
  margin-top: 2px;
`;

const Time = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSub};
  font-variant-numeric: tabular-nums;
`;

const Empty = styled.div`
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSub};
`;

