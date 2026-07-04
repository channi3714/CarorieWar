// src/api/auth.js
import Client from './client';

// 백엔드 준비 전에는 true 로 두고 화면 개발, 연동 시 false
const USE_MOCK = false;

// POST /login - 닉네임 + 비밀번호로 로그인
export async function login(nickname, password) {
  if (USE_MOCK) {
    return {
      userId: 1,
      nickname,
      accessToken: 'mock-access-token',
      tokenType: 'Bearer',
      accessTokenExpiresIn: 3600,
    };
  }

  const { data } = await Client.post('/login', { nickname, password });
  return data.data; // { userId, nickname, accessToken, refreshToken, ... }
}