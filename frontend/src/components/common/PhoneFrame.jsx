// src/components/common/PhoneFrame.jsx
import styled from 'styled-components';

function PhoneFrame({ children }) {
  return (
    <Backdrop>
      <Frame>
        <Screen>{children}</Screen>
      </Frame>
    </Backdrop>
  );
}

export default PhoneFrame;

const Backdrop = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2a2a2a;
  padding: 20px;
`;

const Frame = styled.div`
  width: 360px;
  background: #111;
  padding: 12px;
  border-radius: 48px;
  position: relative;
`;

const Screen = styled.div`
  width: 100%;
  height: 720px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 38px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
`;