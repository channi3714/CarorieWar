// src/api/client.js
import axios from 'axios';

const Client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
});

// 요청마다 토큰 자동 첨부
Client.interceptors.request.use((config) => {
  const Token = localStorage.getItem('accessToken');
  if (Token) {
    config.headers.Authorization = `Bearer ${Token}`;
  }
  return config;
});

export default Client;