// src/components/common/Logo.jsx
import styled from 'styled-components';

const SIZES = {
  sm: '18px',
  md: '22px',
  lg: '28px',
};

function Logo({ size = 'md' }) {
  return (
    <Text $size={size}>
      Calorie<span>NyamNyam</span>
    </Text>
  );
}

export default Logo;

const Text = styled.span`
  font-weight: 800;
  font-size: ${({ $size }) => SIZES[$size]};
  color: ${({ theme }) => theme.colors.text};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;