import styled from '@emotion/styled';
import { useState } from 'react';
import CommentForm from './CommentForm.tsx';
import CommentList from './CommentList.tsx';

const Guestbook = () => {
  const [showComments, setShowComments] = useState(false);

  return (
    <GuestBookWrapper>
      <StyledHeading>
        Vui lòng để lại lời chúc.
        <br />
        Lời chúc sẽ được lưu lại, và được chuyển đến cô dâu chú rể.
      </StyledHeading>
      <CommentForm />
      
      <ToggleButton onClick={() => setShowComments(!showComments)}>
        {showComments ? '🔼 Ẩn lời chúc' : '🔽 Xem lời chúc đã gửi'}
      </ToggleButton>
      
      {showComments && (
        <CommentsSection>
          <CommentsTitle>Lời chúc từ mọi người 💝</CommentsTitle>
          <CommentList />
        </CommentsSection>
      )}
    </GuestBookWrapper>
  );
};

export default Guestbook;

const StyledHeading = styled.p`
  font-family: 'Crimson Text', serif;
  font-size: 1.1rem;
  margin: 10px 0 20px 0;
  white-space: pre-line;
  text-align: center;
  color: #44484d;
  line-height: 1.6;
  font-weight: 500;
  padding: 16px;
  background: linear-gradient(135deg, rgba(255, 238, 245, 0.3) 0%, rgba(248, 244, 249, 0.3) 100%);
  border-radius: 12px;
  border: 1px solid rgba(232, 140, 166, 0.2);
  
  &::before {
    content: '💌 ';
    font-size: 1.2rem;
  }
  
  &::after {
    content: ' 💕';
    font-size: 1rem;
  }
`;

const GuestBookWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 50px;
`;

const ToggleButton = styled.button`
  padding: 12px 20px;
  margin-top: 8px;
  border: 2px solid rgba(232, 140, 166, 0.3);
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 244, 249, 0.9) 100%);
  color: #44484d;
  font-size: 0.95rem;
  font-family: 'Crimson Text', serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(232, 140, 166, 0.1);
  
  &:hover {
    background: linear-gradient(135deg, #ffeef5 0%, #f8f4f9 100%);
    border-color: rgba(232, 140, 166, 0.5);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(232, 140, 166, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CommentsSection = styled.div`
  margin-top: 16px;
  padding: 20px;
  border: 2px solid rgba(232, 140, 166, 0.2);
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 244, 249, 0.7) 100%);
  box-shadow: 0 4px 20px rgba(232, 140, 166, 0.1);
`;

const CommentsTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.2rem;
  color: #44484d;
  text-align: center;
  font-family: 'Playfair Display', serif;
  font-weight: 600;
`;
