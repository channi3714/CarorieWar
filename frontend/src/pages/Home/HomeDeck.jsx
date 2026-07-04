import { useState } from 'react';
import styled from 'styled-components';
import BottomSheet from '../../components/common/BottomSheet';
import LoginModal from '../../components/common/LoginModal';
import useAuthStore from '../../store/useAuthStore';
import Home from './Home';
import WorkList from '../WorkList/WorkList';

// 지도(Home) 위에 운동 목록 바텀시트를 얹는 화면
// 평소엔 시트를 숨겨두고, 가운데 '운동시작' 버튼을 누르면 올라옴
function HomeDeck() {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  // 로그인 상태면 바텀시트를 올리고, 아니면 로그인 모달을 띄움
  const handleStart = () => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    setOpen(true);
  };

  return (
    <Stage>
      <Home onStart={handleStart} />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => {
          setLoginOpen(false);
          setOpen(true); // 로그인 직후 바로 운동 선택 시트 열기
        }}
      />

      {open && (
        <>
          <Backdrop onClick={() => setOpen(false)} />
          {/* 하단 푸터(72px) 위에서 올라오도록 offset, 푸터·운동시작 버튼은 계속 보임 */}
          <BottomSheet defaultExpanded peek={40} expand={82} offset={72} onClose={() => setOpen(false)}>
            <WorkList />
          </BottomSheet>
        </>
      )}
    </Stage>
  );
}

export default HomeDeck;

const Stage = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;

// 바텀시트 뒤 반투명 배경 ( 탭하면 닫힘, 푸터보다 아래라 버튼은 계속 보임 )
const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: 490;
  background: rgba(0, 0, 0, 0.35);
`;
