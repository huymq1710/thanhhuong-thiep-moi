import styled from '@emotion/styled';
import CommentList from '../Guestbook/CommentList.tsx';
import { Heading1 } from '@/components/Text.tsx';
import Wrapper from '@/components/Wrapper.tsx';

const ViewAllComments = () => {
  return (
    <Container>
      <Wrapper>
        <Heading1>Tất cả lời chúc 💝</Heading1>
        <BackButton onClick={() => window.history.back()}>
          ← Quay lại trang chính
        </BackButton>
        <CommentsContainer>
          <CommentList />
        </CommentsContainer>
      </Wrapper>
    </Container>
  );
};

export default ViewAllComments;

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px 0;
`;

const BackButton = styled.button`
  margin-bottom: 20px;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  color: #333;
  font-size: 0.9rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f0f0f0;
    border-color: #bbb;
  }
`;

const CommentsContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
