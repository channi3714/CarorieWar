// src/hooks/useGeolocation.js
import { useState, useEffect } from 'react';

// 권한 거부 / 미지원 시 폴백 ( 서울시청 )
const DEFAULT_COORDS = { lat: 37.5665, lng: 126.978 };

function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('위치 서비스를 지원하지 않는 브라우저입니다');
      setCoords(DEFAULT_COORDS);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => {
        setError('위치 권한이 거부되었습니다');
        setCoords(DEFAULT_COORDS);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { coords, error };
}

export default useGeolocation;