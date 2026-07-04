import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import L from 'leaflet';

// 위치 확보 전에도 지도를 먼저 그리기 위한 폴백 ( 서울시청 )
const FALLBACK = { lat: 37.5665, lng: 126.978 };

// 라벨 없는 밝은 타일 ( CartoDB Positron no-labels )
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';

// 빨간 점 핀 ( 실제 좌표에 고정 )
const PinIcon = L.divIcon({
  className: 'calorie-pin',
  html: `
    <div style="
      width:20px; height:20px; border-radius:50%;
      background:#E1272E; border:4px solid #fff;
      box-shadow:0 0 0 2px #E1272E, 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// 원 중심 라벨 ( 아이콘 이미지 + 텍스트, 아이콘 중심이 좌표에 오도록 )
// iconUrl 이 있으면( 내 운동 ) 흰 배지 + 운동 아이콘,
// 없으면( 상대 플레이어 - 백엔드가 운동 종류를 안 줌 ) 팀색으로 꽉 찬 사람 마커로 또렷하게 표시
function labelIcon(iconUrl, text, color) {
  const Badge = iconUrl
    ? `<div style="
          width:28px;height:28px;border-radius:50%;background:#fff;
          border:2px solid ${color};display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 6px rgba(0,0,0,0.25)">
          <img src="${iconUrl}" onerror="this.style.display='none'"
               style="width:16px;height:16px;object-fit:contain" />
        </div>`
    : `<div style="
          width:28px;height:28px;border-radius:50%;background:${color};
          border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;
          box-shadow:0 0 0 1.5px ${color},0 2px 6px rgba(0,0,0,0.35)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12Zm0 2.1c-3.4 0-7 1.7-7 4.6v1.4h14v-1.4c0-2.9-3.6-4.6-7-4.6Z"/>
          </svg>
        </div>`;

  return L.divIcon({
    className: 'circle-label',
    html: `
      <div style="position:relative;width:80px;height:28px">
        <div style="position:absolute;left:50%;top:0;transform:translateX(-50%)">
          ${Badge}
        </div>
        <div style="
          position:absolute;left:50%;top:31px;transform:translateX(-50%);
          font-size:11px;font-weight:700;color:#333;white-space:nowrap;
          text-shadow:0 0 3px #fff,0 0 3px #fff">${text}</div>
      </div>`,
    iconSize: [80, 28],
    iconAnchor: [40, 14], // 배지 중심을 좌표에 맞춤
  });
}

// myCircle : { lat, lng, radius, color, label, icon }
// players  : [{ latitude, longitude, radius, teamColor, nickname, icon, exercise }]
// showPin  : 내 위치 빨간 핀 표시 여부 ( Working 에선 false )
function KakaoMap({ center, level = 4, myCircle = null, players = [], showPin = true }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const myCircleRef = useRef(null);
  const myLabelRef = useRef(null);
  const playerLayerRef = useRef(null);

  // 지도 생성 ( 1회 )
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const Start = center ?? FALLBACK;
    const Zoom = 18 - level;

    mapRef.current = L.map(containerRef.current, {
      center: [Start.lat, Start.lng],
      zoom: Zoom,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(TILE_URL, { maxZoom: 20 }).addTo(mapRef.current);
    if (showPin) {
      markerRef.current = L.marker([Start.lat, Start.lng], { icon: PinIcon }).addTo(mapRef.current);
    }
    playerLayerRef.current = L.layerGroup().addTo(mapRef.current); // 상대 원 + 라벨 묶음

    const Observer = new ResizeObserver(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    });
    Observer.observe(containerRef.current);

    return () => {
      Observer.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // center 갱신 시 지도 중심 · 핀 이동
  useEffect(() => {
    if (!mapRef.current || !center) return;
    const Pos = [center.lat, center.lng];
    mapRef.current.setView(Pos);
    if (markerRef.current) markerRef.current.setLatLng(Pos);
  }, [center]);

  // 내 원 + 중심 라벨
  useEffect(() => {
    if (!mapRef.current) return;

    if (!myCircle) {
      if (myCircleRef.current) {
        myCircleRef.current.remove();
        myCircleRef.current = null;
      }
      if (myLabelRef.current) {
        myLabelRef.current.remove();
        myLabelRef.current = null;
      }
      return;
    }

    const LatLng = [myCircle.lat, myCircle.lng];

    if (!myCircleRef.current) {
      myCircleRef.current = L.circle(LatLng, {
        radius: myCircle.radius,
        color: myCircle.color,
        fillColor: myCircle.color,
        fillOpacity: 0.3,
        weight: 2,
      }).addTo(mapRef.current);
    } else {
      myCircleRef.current.setLatLng(LatLng);
      myCircleRef.current.setRadius(myCircle.radius);
      myCircleRef.current.setStyle({ color: myCircle.color, fillColor: myCircle.color });
    }

    const Text = myCircle.label ?? '내 운동';
    const Icon = myCircle.icon ?? '';
    if (!myLabelRef.current) {
      myLabelRef.current = L.marker(LatLng, {
        icon: labelIcon(Icon, Text, myCircle.color),
        interactive: false,
      }).addTo(mapRef.current);
    } else {
      myLabelRef.current.setLatLng(LatLng);
      myLabelRef.current.setIcon(labelIcon(Icon, Text, myCircle.color));
    }
  }, [myCircle]);

  // 상대 플레이어 원 + 라벨 ( 매번 다시 그림 )
  useEffect(() => {
    if (!mapRef.current || !playerLayerRef.current) return;
    playerLayerRef.current.clearLayers();

    players.forEach((P) => {
      const LatLng = [P.latitude, P.longitude];

      L.circle(LatLng, {
        radius: P.radius,
        color: P.teamColor,
        fillColor: P.teamColor,
        fillOpacity: 0.25,
        weight: 2,
      }).addTo(playerLayerRef.current);

      const Label = P.exercise ? `${P.nickname}님이 ${P.exercise} 중` : `${P.nickname}님이 운동 중`;
      L.marker(LatLng, {
        icon: labelIcon(P.icon ?? '', Label, P.teamColor),
        interactive: false,
      }).addTo(playerLayerRef.current);
    });
  }, [players]);

  return <Container ref={containerRef} />;
}

export default KakaoMap;

const Container = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.mapArea};
`;