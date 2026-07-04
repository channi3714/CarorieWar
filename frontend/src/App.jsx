// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import ProtectedRoute from './routes/ProtectedRoute';
import PhoneFrame from './components/common/PhoneFrame';

import Login from './pages/Login/Login';
import SignUp from './pages/Login/SignUp';
import HomeDeck from './pages/Home/HomeDeck';
import WorkAdd from './pages/WorkAdd/WorkAdd';
import Working from './pages/Working/Working';
import Ranking from './pages/Ranking/Ranking';
import MyPage from './pages/MyPage/MyPage';

function App() {
  return (
    <PhoneFrame>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<SignUp />} />

        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.HOME} element={<HomeDeck />} />
          <Route path={ROUTES.WORK_LIST} element={<HomeDeck />} />
          <Route path={ROUTES.WORK_ADD} element={<WorkAdd />} />
          <Route path={ROUTES.WORKING} element={<Working />} />
          <Route path={ROUTES.RANKING} element={<Ranking />} />
          <Route path={ROUTES.MYPAGE} element={<MyPage />} />
        </Route>
      </Routes>
    </PhoneFrame>
  );
}

export default App;