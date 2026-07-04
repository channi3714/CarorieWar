import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrophy, FaWalking, FaPause } from 'react-icons/fa';
import KakaoMap from '../../components/map/KakaoMap';
import Footer from '../../components/common/Footer';
import useGeolocation from '../../hooks/useGeolocation';
import useSessionStore from '../../store/useSessionStore';
import { getWorking, startWorking, postScore, finishWorking } from '../../api/working';
import { ROUTES } from '../../constants/routes';
import { iconOf } from '../../assets/icons';
import Logo from '../../components/common/Logo';

const POLL_MS = 3000;

function formatTime(ms) {
  const Total = Math.floor(ms / 1000);
  const M = String(Math.floor(Total / 60)).padStart(2, '0');
  const S = String(Total % 60).padStart(2, '0');
  return `${M}:${S}`;
}

function Working() {
  const navigate = useNavigate();
  const { coords } = useGeolocation();

  const startSession = useSessionStore((s) => s.startSession);
  const applyScore = useSessionStore((s) => s.applyScore);
  const endSession = useSessionStore((s) => s.endSession);
  const startedAt = useSessionStore((s) => s.startedAt);
  const exercise = useSessionStore((s) => s.exercise);
  const center = useSessionStore((s) => s.center);
  const totalScore = useSessionStore((s) => s.totalScore);
  const myRadius = useSessionStore((s) => s.myRadius);
  const players = useSessionStore((s) => s.players);

  const [elapsed, setElapsed] = useState(0);
  const [event, setEvent] = useState(null); // { type, opponent }
  const [error, setError] = useState('');
  const startedFixRef = useRef(false);

  // 진입 - 선택된 운동 확인
  useEffect(() => {
    let Alive = true;
    (async () => {
      try {
        const Info = await getWorking();
        if (Alive && !useSessionStore.getState().active) {
          startSession(Info, null);
        }
      } catch (err) {
        if (Alive) {
          setError(err.response?.data?.message ?? '선택된 운동이 없습니다');
          setTimeout(() => navigate(ROUTES.WORK_LIST), 1200);
        }
      }
    })();
    return () => {
      Alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 위치 확보되면 시작 위치 1회 고정
  useEffect(() => {
    if (!coords || startedFixRef.current) return;
    startedFixRef.current = true;
    (async () => {
      try {
        await startWorking(coords.lat, coords.lng);
        useSessionStore.setState({ center: coords });
      } catch (err) {
        setError(err.response?.data?.message ?? '시작 위치 고정 실패');
      }
    })();
  }, [coords]);

  // 타이머 - startedAt 기준 계산, interval 은 리렌더용
  useEffect(() => {
    if (!startedAt) return;
    const Id = setInterval(() => setElapsed(Date.now() - startedAt), 1000);
    return () => clearInterval(Id);
  }, [startedAt]);

  // 3초마다 점수 폴링
  useEffect(() => {
    if (!center) return; // 시작 위치 고정 후부터
    let Alive = true;

    const tick = async () => {
      try {
        const Res = await postScore();
        if (!Alive) return;
        applyScore({
          totalScore: Res.totalScore,
          myRadius: Res.myRadius,
          players: Res.nearbyPlayers,
        });
        if (Res.eventType) setEvent({ type: Res.eventType, opponent: Res.eventOpponentNickname });
      } catch {
        /* 폴링 실패는 조용히 무시하고 다음 주기 재시도 */
      }
    };

    tick(); // 즉시 1회
    const Id = setInterval(tick, POLL_MS);
    return () => {
      Alive = false;
      clearInterval(Id);
    };
  }, [center, applyScore]);

  const handleStop = async () => {
    try {
      await finishWorking({
        exerciseId: exercise?.exerciseId,
        durationMs: elapsed,
        totalScore,
        myRadius,
      });
    } catch {
      /* 데모: 저장 실패해도 종료 진행 */
    }
    endSession();
    // 요약/확인 화면은 와이어프레임 확정 후 연결 - 지금은 Home 으로
    navigate(ROUTES.HOME, { replace: true });
  };

  const MyCircle = center
    ? {
        lat: center.lat,
        lng: center.lng,
        radius: myRadius,
        color: '#4CAF50',
        label: `내가 ${exercise?.name ?? ''} 중`,
        icon: iconOf(exercise?.exerciseId),
      }
    : null;

  return (  
    
    <Page>
      <TopLogo>
        <Logo size="sm" />
      </TopLogo>
      <KakaoMap center={center ?? coords} level={2} myCircle={MyCircle} players={players} showPin={false} />
      {event && (
        <EventBanner $type={event.type}>
          {event.type === 'MEETING' && `${event.opponent} 와(과) 영역이 맞닿았어요!`}
          {event.type === 'CONQUERED' && `${event.opponent} 를(을) 정복했어요! 🎉`}
          {event.type === 'CONQUERED_BY_OPPONENT' && `${event.opponent} 에게 정복당했어요…`}
        </EventBanner>
      )}

      <Panel>
        <ExName>{exercise?.name ?? '운동 중'}</ExName>
        <Timer>{formatTime(elapsed)}</Timer>
        <Score>{totalScore}</Score>
        <ScoreLabel>소모 칼로리 (kcal)</ScoreLabel>
        {error && <ErrorText>{error}</ErrorText>}
      </Panel>

      <FooterWrap>
        <Footer
          left={{ icon: <FaTrophy />, label: '랭킹', onClick: () => navigate(ROUTES.RANKING) }}
          center={{ icon: <FaPause />, label: '정지', variant: 'dark', onClick: handleStop }}
          right={{ icon: <FaWalking />, label: '나의 기록', onClick: () => navigate(ROUTES.WORK_LIST) }}
        />
      </FooterWrap>
    </Page>
  );
}

export default Working;

const Page = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;

// 상단 여백 + 흰색 그라데이션 ( 로고 · 인사말 가독성 확보, 지도 조작은 통과 )
const TopLogo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 900;
  padding: 7px 25px;
  background: white;
  pointer-events: none;
`;

const EventBanner = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 920;
  padding: 10px 18px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  background: ${({ theme, $type }) =>
    $type === 'CONQUERED'
      ? theme.colors.success
      : $type === 'CONQUERED_BY_OPPONENT'
      ? '#555'
      : theme.colors.primary};
`;

const Panel = styled.div`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 96px;
  z-index: 915;
  padding: 24px 20px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

const ExName = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSub};
  margin-bottom: 8px;
  text-align: left;
`;

const Timer = styled.div`
  font-size: 48px;
  font-weight: 800;
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
`;

const Score = styled.div`
  margin-top: 14px;
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

const ScoreLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSub};
  margin-top: 4px;
`;

const ErrorText = styled.p`
  margin-top: 10px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
`;

const FooterWrap = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 915;
`;