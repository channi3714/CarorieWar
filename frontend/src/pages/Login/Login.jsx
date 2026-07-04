// src/pages/Login/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { login } from '../../api/auth';
import useAuthStore from '../../store/useAuthStore';
import { ROUTES } from '../../constants/routes';
import Logo from '../../components/common/Logo';

function Login() {
  const navigate = useNavigate();
  const setLogin = useAuthStore((state) => state.login);

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      const Message = err.response?.data?.message ?? '로그인에 실패했습니다';
      setError(Message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <LogoBox><Logo size="sm" /></LogoBox>
        <Title>로그인</Title>

        <Input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <ErrorText>{error}</ErrorText>}

        <LoginButton type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </LoginButton>
      </Form>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  min-height: 100%;
  padding: 0 24px;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const LogoBox = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 32px;
`;

const Input = styled.input`
  width: 100%;
  height: 52px;
  padding: 0 16px;
  margin-bottom: 12px;
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
  margin: 4px 2px 0;
`;

const LoginButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 24px;
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