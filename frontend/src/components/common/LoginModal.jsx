// 로그인 안 된 상태에서 '운동시작'을 누르면 뜨는 로그인 모달
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { login } from '../../api/auth';
import useAuthStore from '../../store/useAuthStore';
import { ROUTES } from '../../constants/routes';
import Logo from './Logo';

function LoginModal({ open, onClose, onSuccess }) {
  const navigate = useNavigate();
  const setLogin = useAuthStore((s) => s.login);

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname || !password) {
      setError('닉네임과 비밀번호를 입력해주세요');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const Data = await login(nickname, password);
      setLogin({ userId: Data.userId, nickname: Data.nickname });
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message ?? '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 배경 탭으로 닫되, 카드 내부 조작은 전파 차단
  return (
    <Overlay onMouseDown={onClose}>
      <Card onMouseDown={(e) => e.stopPropagation()}>
        <CloseBtn type="button" onClick={onClose} aria-label="닫기">×</CloseBtn>
        <LogoBox><Logo size="sm" /></LogoBox>
        <Title>로그인하고 운동을 시작해요</Title>

        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <Submit type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Submit>
        </Form>

        <SignupRow>
          아직 회원이 아니신가요?
          <button type="button" onClick={() => navigate(ROUTES.SIGNUP)}>회원가입</button>
        </SignupRow>
      </Card>
    </Overlay>
  );
}

export default LoginModal;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.45);
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;
  padding: 28px 22px 22px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 14px;
  font-size: 24px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.textSub};
`;

const LogoBox = styled.div`
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  margin-bottom: 10px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSub};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  margin: 2px 2px 0;
`;

const Submit = styled.button`
  width: 100%;
  height: 50px;
  margin-top: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 16px;
  font-weight: 700;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SignupRow = styled.div`
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSub};

  button {
    margin-left: 6px;
    font-size: 13px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }
`;
