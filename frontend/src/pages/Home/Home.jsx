import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrophy, FaUser, FaPlay } from 'react-icons/fa';
import KakaoMap from '../../components/map/KakaoMap';
import Footer from '../../components/common/Footer';
import Logo from '../../components/common/Logo';
import useGeolocation from '../../hooks/useGeolocation';
import { ROUTES } from '../../constants/routes';
import { useEffect, useState } from 'react';
import { getHome } from '../../api/home';

// onStart : 가운데 '운동시작' 버튼을 누르면 부모(HomeDeck)의 바텀시트를 올림
function Home({ onStart }) {
  const navigate = useNavigate();
  const { coords } = useGeolocation();

  const [Home_, setHome] = useState(null);
  useEffect(() => {
    const refresh = () => getHome().then(setHome).catch(() => {});
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, []);

  // 상대 플레이어 ( 백엔드가 운동 종류를 안 주므로 팀색 사람 마커로 표시 - KakaoMap 처리 )
  const players = Home_?.nearbyPlayers ?? [];

  return (
    <Page>
      <KakaoMap
        center={coords}
        level={2}
        players={players}
        myCircle={coords && Home_ ? {
          lat: coords.lat,
          lng: coords.lng,
          radius: 5 + (Home_.totalScore ?? 0) * 0.05,
          color: Home_?.teamColor ?? '#FF5733',
          label: '나',
          icon: '',
        } : null}
      />

      <TopLogo>
        <Logo size="sm" />
      </TopLogo>

      <RegionPill>서울특별시 마포구</RegionPill>

      <FooterWrap>
        <Footer
          left={{ icon: <FaTrophy />, label: '랭킹', onClick: () => navigate(ROUTES.RANKING) }}
          center={{ icon: <FaPlay />, label: '운동시작', variant: 'primary', onClick: onStart }}
          right={{ icon: <FaUser />, label: '마이페이지', onClick: () => navigate(ROUTES.MYPAGE) }}
        />
      </FooterWrap>
    </Page>
  );
}

export default Home;

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
  z-index: 800;
  padding: 7px 25px;
  background: white;
  pointer-events: none;
`;

const RegionPill = styled.div`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 801;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #fff;
  border-radius: 9999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  font-size: 13px;
  font-weight: 600;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
  }
`;

const FooterWrap = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 800;
`;