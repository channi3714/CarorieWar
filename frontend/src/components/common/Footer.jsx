// src/components/common/Footer.jsx
import styled from 'styled-components';

function Footer({ left, center, right }) {
  return (
    <Bar>
      <SideButton onClick={left.onClick}>
        {left.icon}
        <span>{left.label}</span>
      </SideButton>

      <Spacer />

      <SideButton onClick={right.onClick}>
        {right.icon}
        <span>{right.label}</span>
      </SideButton>

      {center && (
        <CenterButton onClick={center.onClick} $variant={center.variant}>
          {center.icon}
          <span>{center.label}</span>
        </CenterButton>
      )}
    </Bar>
  );
}

export default Footer;

const Bar = styled.nav`
  position: relative;
  height: 72px;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const SideButton = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 22px;
  
  span {
    font-size: 11px;
  }
`;

const Spacer = styled.div`
  width: 66px;
  flex-shrink: 0;
`;

const CenterButton = styled.button`
  position: absolute;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #fff;
  font-size: 20px;
  background: ${({ theme, $variant }) =>
    $variant === 'dark' ? theme.colors.text : theme.colors.primary};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  span {
    font-size: 10px;
    font-weight: 700;
  }
`;