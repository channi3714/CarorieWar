import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaChevronLeft, FaPlus, FaCheck } from 'react-icons/fa';
import { getAllSports, addSport, colorOf } from '../../api/sports';
import { ROUTES } from '../../constants/routes';

function WorkAdd() {
  const navigate = useNavigate();

  const [AllSports, setAllSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState(null);

  const load = async () => {
    try {
      const List = await getAllSports();
      setAllSports(List);
    } catch {
      setError('운동 목록을 불러오지 못했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (exerciseId) => {
    setPendingId(exerciseId);
    setError('');
    try {
      await addSport(exerciseId);
      setAllSports((Prev) =>
        Prev.map((Ex) => (Ex.exerciseId === exerciseId ? { ...Ex, isAdded: true } : Ex))
      );
    } catch (err) {
      setError(err.response?.data?.message ?? '추가에 실패했습니다');
    } finally {
      setPendingId(null);
    }
  };

  return (
    <Page>
      <Header>
        <BackButton onClick={() => navigate(ROUTES.WORK_LIST)}>
          <FaChevronLeft />
        </BackButton>
        <Title>운동 추가</Title>
        <Spacer />
      </Header>

      {error && <ErrorText>{error}</ErrorText>}

      <List>
        {loading && <Empty>불러오는 중...</Empty>}
        {!loading &&
          AllSports.map((Ex) => (
            <Item key={Ex.exerciseId}>
              <Dot style={{ background: colorOf(Ex.exerciseId) }} />
              <Info>
                <Name>{Ex.name}</Name>
                <Meta>5분 · {Ex.caloriesPerFiveMin} kcal</Meta>
              </Info>

              {Ex.isAdded ? (
                <AddedTag>
                  <FaCheck size={11} />
                  추가됨
                </AddedTag>
              ) : (
                <AddButton
                  onClick={() => handleAdd(Ex.exerciseId)}
                  disabled={pendingId === Ex.exerciseId}
                >
                  <FaPlus size={11} />
                  추가
                </AddButton>
              )}
            </Item>
          ))}
      </List>
    </Page>
  );
}

export default WorkAdd;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const BackButton = styled.button`
  width: 24px;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
`;

const Title = styled.h2`
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 700;
`;

const Spacer = styled.div`
  width: 24px;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  text-align: center;
  padding: 12px 20px 0;
`;

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 20px 24px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Dot = styled.span`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const Info = styled.div`
  flex: 1;
`;

const Name = styled.div`
  font-size: 15px;
  font-weight: 700;
`;

const Meta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSub};
  margin-top: 2px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 12px;
  font-weight: 700;

  &:disabled {
    opacity: 0.5;
  }
`;

const AddedTag = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textSub};
  font-size: 12px;
  font-weight: 700;
`;

const Empty = styled.div`
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSub};
`;