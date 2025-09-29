import styled from '@emotion/styled';
import data from 'data.json';
import Host from '../Contact/Host.tsx';
import RoundButton from '@/components/RoundButton.tsx';
import { Caption, Paragraph } from '@/components/Text.tsx';

const Invitation = () => {
  const { greeting } = data;
  return (
    <InvitationWrapper>
      <Paragraph>{greeting.message}</Paragraph>
      <Host />
      <Caption textAlign={'center'}>{greeting.eventDetail}</Caption>
      {/* TODO: 구글캘린더 추가하기 기능을 넣는다면 링크 수정 */}
      <RoundButton
        target="_blank"
        href=""
        rel="noreferrer">
        Thêm vào Google Calendar
      </RoundButton>
    </InvitationWrapper>
  );
};

export default Invitation;

const InvitationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(255, 238, 245, 0.4) 0%, rgba(248, 244, 249, 0.4) 100%);
  border-radius: 20px;
  border: 2px solid rgba(232, 140, 166, 0.2);
  box-shadow: 0 6px 25px rgba(232, 140, 166, 0.15);
  position: relative;
  
  &::before {
    content: '💌';
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.4rem;
    background: white;
    padding: 8px 12px;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(232, 140, 166, 0.2);
    border: 2px solid rgba(232, 140, 166, 0.2);
  }
`;
