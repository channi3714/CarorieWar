// src/hooks/useKakaoLoader.js
import { useState, useEffect } from 'react';

// autoload=false 로 불러온 뒤 kakao.maps.load 로 초기화, services 는 역지오코딩용 미리 포함
const SDK_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&autoload=false&libraries=services`;

console.log('KAKAO KEY:', import.meta.env.VITE_KAKAO_MAP_KEY);

function useKakaoLoader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 이미 초기화된 경우
    if (window.kakao && window.kakao.maps && window.kakao.maps.Map) {
      setLoaded(true);
      return;
    }

    const OnLoad = () => window.kakao.maps.load(() => setLoaded(true));

    // 스크립트가 이미 삽입돼 있으면 로드만 기다림 ( 중복 삽입 방지 )
    const Existing = document.querySelector('script[src*="dapi.kakao.com"]');
    if (Existing) {
      Existing.addEventListener('load', OnLoad);
      return;
    }

    const Script = document.createElement('script');
    Script.src = SDK_URL;
    Script.async = true;
    Script.addEventListener('load', OnLoad);
    document.head.appendChild(Script);
  }, []);

  return loaded;
}

export default useKakaoLoader;