// import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import data from 'data.json';
// import { increment, onValue, ref, update } from 'firebase/database';
// import { realtimeDb } from 'firebase.ts';
import JSConfetti from 'js-confetti';
import Heart from '@/assets/icons/heart_plus.svg?react';
import Share from '@/assets/icons/share.svg?react';
import Upward from '@/assets/icons/upward.svg?react';
import Button from '@/components/Button.tsx';

const FloatingBar = ({ isVisible }: { isVisible: boolean }) => {
  const { emojis } = data;

  // TODO: count 기능 사용 원할시 firebase realtime db 연결!
  // const [count, setCount] = useState(0);

  // useEffect(() => {
  // TODO: realtime db 에 likes 객체 추가.
  //   const dbRef = ref(realtimeDb, 'likes');
  //   onValue(dbRef, (snapshot) => {
  //     setCount(Number(snapshot.val()));
  //   });
  // }, []);

  const handleCopy = async () => {
    try {
      // Kiểm tra xem clipboard API có khả dụng không
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
        alert('Địa chỉ đã được sao chép.😉😉');
      } else {
        // Fallback cho các trường hợp không hỗ trợ clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          alert('Địa chỉ đã được sao chép.😉😉');
        } catch (err) {
          console.error('Fallback copy failed:', err);
          alert('Sao chép địa chỉ thất bại.🥲🥲');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('Copy failed:', err);
      alert('Sao chép địa chỉ thất bại.🥲🥲');
    }
  };

  const handleCount = () => {
    void jsConfetti.addConfetti({ emojis });

    // 버튼 클릭시 likes 수 증가
    // const dbRef = ref(realtimeDb);
    // void update(dbRef, {
    //   likes: increment(1),
    // });
  };

  const handleViewComments = () => {
    // Tìm phần guestbook và cuộn xuống
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    
    // Tìm heading có text "Gửi đến cô dâu chú rể"
    const guestbookHeading = headings.find(heading => 
      heading.textContent?.includes('Gửi đến cô dâu chú rể')
    );
    
    if (guestbookHeading) {
      // Cuộn đến phần guestbook với hiệu ứng mượt
      guestbookHeading.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      // Fallback: cuộn xuống dưới cùng
      window.scrollTo({ 
        top: document.body.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  const jsConfetti = new JSConfetti();
  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Nav isVisible={isVisible}>
      <Button onClick={handleCount}>
        <Heart fill="#e88ca6" />
        {/*{count || ''}*/}
      </Button>
      <Button onClick={handleCopy}>
        <Share fill="#e88ca6" />
        Chia sẻ
      </Button>
      <Button onClick={handleViewComments}>
        💌
        Lời chúc
      </Button>
      <Button onClick={handleScroll}>
        <Upward fill="#e88ca6" />
        Lên trên
      </Button>
    </Nav>
  );
};

export default FloatingBar;

const Nav = styled.nav<{ isVisible: boolean }>`
  min-width: 320px;
  position: fixed;
  bottom: 30px;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  gap: 5px;
  display: ${(props) => (props.isVisible ? 'flex' : 'none')};
`;
