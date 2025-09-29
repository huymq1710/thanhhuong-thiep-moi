import styled from '@emotion/styled';
import data from 'data.json';
import Address from './Address.tsx';
import MapButtons from './MapButtons.tsx';
import { Caption } from '@/components/Text.tsx';
import GoogleMap from './GoogleMap.tsx';

const Location = () => {
  const { mapInfo } = data;
  return (
    <LocationWrapper>
      <LocationTitle>{mapInfo.address1}</LocationTitle>
      <Caption textAlign={'center'}>{mapInfo.address2}</Caption>
      <GoogleMap />
      <MapButtons />
      <Address />
    </LocationWrapper>
  );
};

export default Location;

const LocationTitle = styled.p`
  font-family: 'Playfair Display', serif;
  line-height: 1.2;
  margin: 0 0 8px 0;
  color: #e88ca6;
  white-space: pre-line;
  font-weight: 600;
  font-size: 0.847rem;
  text-align: center;
  /* Không có ::after để loại bỏ đường kẻ dưới */
`;

const LocationWrapper = styled.div`
  width: 100%;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(255, 238, 245, 0.4) 0%, rgba(248, 244, 249, 0.4) 100%);
  border-radius: 20px;
  border: 2px solid rgba(232, 140, 166, 0.2);
  box-shadow: 0 6px 25px rgba(232, 140, 166, 0.15);
  position: relative;
  box-sizing: border-box;
  
  &::before {
    content: '📍';
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
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 95%;
    padding: 20px 16px;
    gap: 16px;
  }
`;
