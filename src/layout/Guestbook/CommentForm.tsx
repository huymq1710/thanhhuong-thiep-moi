import { useState } from 'react';
import styled from '@emotion/styled';
import { push, ref, serverTimestamp } from 'firebase/database';
import { realtimeDb } from '../../firebase.ts';

const CommentForm = () => {
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!name || !message) {
      alert('Vui lòng điền tên và lời nhắn. 🥹');
      return;
    }

    if (!realtimeDb) {
      alert('Tính năng gửi lời chúc chưa được cấu hình. Vui lòng thiết lập Firebase Realtime Database. 😔');
      return;
    }

    try {
      const guestbookRef = ref(realtimeDb, 'guestbook');
      const guestbookMessage = {
        sender: name,
        message: message,
        createdAt: serverTimestamp(),
        date: new Date().toLocaleString('vi-VN'),
      };
      
      await push(guestbookRef, guestbookMessage);
      alert('Lời chúc đã được gửi thành công! 💌');
      setName('');
      setMessage('');
    } catch (error) {
      console.error('Lỗi khi gửi lời chúc:', error);
      alert('Có lỗi xảy ra khi gửi lời chúc. Vui lòng thử lại! 😔');
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <NameInput
        placeholder="Tên"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <MessageInput
        placeholder="Lời nhắn"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <SubmitButton type="submit">Gửi lời chúc</SubmitButton>
    </FormWrapper>
  );
};

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: visible;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #ffeef5 0%, #f8f4f9 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(232, 140, 166, 0.1);
  border: 1px solid rgba(232, 140, 166, 0.2);
`;

const NameInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 1rem;
  line-height: 1.4;
  outline: none;
  border: 2px solid rgba(232, 140, 166, 0.3);
  font-family: 'Crimson Text', serif;
  font-weight: 400;
  background-color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(68, 72, 77, 0.6);
    font-style: italic;
  }
  
  &:focus {
    border-color: #e88ca6;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(232, 140, 166, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: rgba(232, 140, 166, 0.5);
  }
`;

const MessageInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  max-height: 200px;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 1rem;
  line-height: 1.5;
  outline: none;
  border: 2px solid rgba(232, 140, 166, 0.3);
  resize: vertical;
  font-family: 'Crimson Text', serif;
  font-weight: 400;
  background-color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(68, 72, 77, 0.6);
    font-style: italic;
  }
  
  &:focus {
    border-color: #e88ca6;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(232, 140, 166, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: rgba(232, 140, 166, 0.5);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px 24px;
  border-radius: 25px;
  font-size: 1.1rem;
  line-height: 1.5;
  border: none;
  background: linear-gradient(135deg, #e88ca6 0%, #d678a0 100%);
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px rgba(232, 140, 166, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(232, 140, 166, 0.4);
    background: linear-gradient(135deg, #d678a0 0%, #c26693 100%);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(232, 140, 166, 0.3);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(232, 140, 166, 0.3);
  }
`;
export default CommentForm;
