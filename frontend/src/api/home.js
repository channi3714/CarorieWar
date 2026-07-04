import Client from './client';
import { iconOf } from '../assets/icons';

const USE_MOCK = false;

function delay(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// working 과 동일한 3명 ( 신촌 부근 )
function mockNearby(myLat = 37.5559, myLng = 126.9368) {
  return [
    { nickname: '수영왕', latitude: myLat + 0.0022, longitude: myLng - 0.0026, radius: 180, teamColor: '#E1272E', icon: iconOf(3), exercise: '수영' },
    { nickname: '러닝왕', latitude: myLat + 0.0030, longitude: myLng + 0.0005, radius: 260, teamColor: '#F5A623', icon: iconOf(5), exercise: '러닝' },
    { nickname: '자전거왕', latitude: myLat + 0.0008, longitude: myLng + 0.0030, radius: 90, teamColor: '#9013FE', icon: iconOf(6), exercise: '자전거' },
  ];
}

// GET /home - 지도 점령 현황 + 내 상태
export async function getHome() {
  if (USE_MOCK) {
    await delay();
    return {
      nickname: '칼로리요정',
      totalScore: 340,
      myRadius: 22.0,
      teamColor: '#FF5733',
      nearbyPlayers: mockNearby(),
    };
  }
  const { data } = await Client.get('/home');
  return data.data;
}