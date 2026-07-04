import styled from 'styled-components';
import BottomSheet from '../../components/common/BottomSheet';
import Home from './Home';
import WorkList from '../WorkList/WorkList';

function HomeDeck() {
  return (
    <Stage>
      <Home />
      <BottomSheet peek={22} expand={88}>
        <WorkList />
      </BottomSheet>
    </Stage>
  );
}

export default HomeDeck;

const Stage = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
`;