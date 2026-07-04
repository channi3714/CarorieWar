import { useState, useRef } from 'react';
import styled from 'styled-components';

// 지도 위에 떠서 위아래로 끌어올리는 바텀시트
// peek : 살짝 걸친 높이 / expand : 펼친 높이 ( 화면 대비 % )
// offset : 시트 바닥을 화면 하단에서 띄우는 값 ( px, 하단 푸터 높이만큼 비워 버튼을 가리지 않게 )
function BottomSheet({ children, peek = 22, expand = 88, defaultExpanded = false, offset = 0, onClose }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [dragY, setDragY] = useState(0); // 드래그 중 임시 이동 ( px, 음수 = 위로 )
  const [dragging, setDragging] = useState(false);

  const startY = useRef(0);
  const sheetRef = useRef(null);

  // 현재 목표 높이 ( vh )
  const TargetVh = expanded ? expand : peek;

  const onPointerDown = (e) => {
    setDragging(true);
    startY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    setDragY(e.clientY - startY.current);
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    // 위로 40px 이상 끌면 펼침, 아래로 40px 이상이면 접음 ( 이미 접힌 상태면 닫기 )
    if (dragY < -40) setExpanded(true);
    else if (dragY > 40) {
      if (!expanded) onClose?.();
      else setExpanded(false);
    }
    setDragY(0);
  };

  // 높이 = 목표 vh - 드래그량 ( 위로 끌면 dragY 음수라 높이 증가 )
  const Height = `calc(${TargetVh}% - ${dragY}px)`;

  return (
    <Sheet
      ref={sheetRef}
      $dragging={dragging}
      style={{ height: Height, bottom: offset }}
    >
      <HandleZone
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={() => setExpanded((v) => !v)}
      >
        <Handle />
      </HandleZone>

      <Body>{children}</Body>
    </Sheet>
  );
}

export default BottomSheet;

const Sheet = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.12);
  transition: ${({ $dragging }) => ($dragging ? 'none' : 'height 0.28s ease')};
  will-change: height;
  overflow: hidden;
`;

// 손잡이 영역 - 여기만 드래그 감지 ( 목록 스크롤과 충돌 방지 )
const HandleZone = styled.div`
  flex-shrink: 0;
  padding: 10px 0 6px;
  display: flex;
  justify-content: center;
  cursor: grab;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`;

const Handle = styled.div`
  width: 44px;
  height: 5px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.border};
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;