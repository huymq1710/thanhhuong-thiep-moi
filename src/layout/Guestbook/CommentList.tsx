import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ref, onValue, DataSnapshot } from 'firebase/database';
import { realtimeDb } from '../../firebase.ts';

interface Comment {
  id: string;
  sender: string;
  message: string;
  createdAt: number;
  date: string;
}

const CommentList = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!realtimeDb) {
      setLoading(false);
      return;
    }

    const guestbookRef = ref(realtimeDb, 'guestbook');
    
    const unsubscribe = onValue(guestbookRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        const commentsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
        setComments(commentsList);
      } else {
        setComments([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!realtimeDb) {
    return <EmptyText>Tính năng lời chúc chưa được cấu hình. Vui lòng thiết lập Firebase Realtime Database. 🔧</EmptyText>;
  }

  if (loading) {
    return <LoadingText>Đang tải lời chúc...</LoadingText>;
  }

  if (comments.length === 0) {
    return <EmptyText>Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc! 💌</EmptyText>;
  }

  return (
    <CommentListWrapper>
      {comments.map((comment) => (
        <CommentItem key={comment.id}>
          <CommentHeader>
            <SenderName>{comment.sender}</SenderName>
            <CommentDate>{comment.date}</CommentDate>
          </CommentHeader>
          <CommentMessage>{comment.message}</CommentMessage>
        </CommentItem>
      ))}
    </CommentListWrapper>
  );
};

export default CommentList;

const CommentListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
  border: 2px solid rgba(232, 140, 166, 0.2);
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 244, 249, 0.6) 100%);
  box-shadow: inset 0 2px 10px rgba(232, 140, 166, 0.05);
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(232, 140, 166, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(232, 140, 166, 0.4);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(232, 140, 166, 0.6);
  }
`;

const CommentItem = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 238, 245, 0.7) 100%);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(232, 140, 166, 0.2);
  box-shadow: 0 3px 10px rgba(232, 140, 166, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(232, 140, 166, 0.15);
    border-color: rgba(232, 140, 166, 0.3);
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(232, 140, 166, 0.2);
`;

const SenderName = styled.span`
  font-weight: 600;
  color: #44484d;
  font-size: 0.665rem;
  font-family: 'Playfair Display', serif;
  position: relative;
  
  &::after {
    content: '💕';
    margin-left: 6px;
    font-size: 0.56rem;
  }
`;

const CommentDate = styled.span`
  font-size: 0.56rem;
  color: rgba(68, 72, 77, 0.7);
  font-family: 'Crimson Text', serif;
  font-style: italic;
`;

const CommentMessage = styled.p`
  margin: 0;
  line-height: 1.6;
  color: #44484d;
  font-size: 0.63rem;
  white-space: pre-wrap;
  font-family: 'Crimson Text', serif;
  font-weight: 400;
`;

const LoadingText = styled.div`
  text-align: center;
  color: rgba(68, 72, 77, 0.7);
  font-style: italic;
  padding: 30px;
  font-family: 'Crimson Text', serif;
  font-size: 0.7rem;
  
  &::before {
    content: '💌 ';
    font-size: 0.84rem;
  }
`;

const EmptyText = styled.div`
  text-align: center;
  color: rgba(68, 72, 77, 0.7);
  font-style: italic;
  padding: 30px;
  border: 2px dashed rgba(232, 140, 166, 0.3);
  border-radius: 12px;
  margin-top: 20px;
  background: linear-gradient(135deg, rgba(255, 238, 245, 0.3) 0%, rgba(248, 244, 249, 0.3) 100%);
  font-family: 'Crimson Text', serif;
  font-size: 1rem;
`;
