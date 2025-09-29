import React from 'react';
import styled from '@emotion/styled';
import data from 'data.json';
import { BrideAndGroom } from '@/types/data.ts';

const Host = () => {
  const { groom, bride } = data.greeting.host;
  return (
    <>
      <HostContainer>
        <HostInfo person={groom} />
        <HostInfo person={bride} />
      </HostContainer>
    </>
  );
};

export default Host;

const HostInfo = ({ person }: { person: BrideAndGroom }) => {
  // Hardcode names based on relation
  const displayName = person.relation === 'Con trai' ? '🤵🏻‍♂️ Mạc Quang Huy' : '👰🏻‍♀️ Hoàng Thanh Hương';
  
  return (
    <HostDetails>
      <HighlightedName>{displayName}</HighlightedName>
      <RelationshipText>
        Bố mẹ
      </RelationshipText>
      <ParentsInfo>
        {person.parents && (
          <>
            {person.parents.map((parent, index) => (
              <React.Fragment key={index}>
                {index > 0 && ' · '}
                {parent.name}
              </React.Fragment>
            ))}
          </>
        )}
      </ParentsInfo>
    </HostDetails>
  );
};

const HighlightedName = styled.span`
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  font-size: 1.2rem;
  color: #44484d;
  margin-bottom: 6px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #e88ca6, transparent);
    border-radius: 1px;
  }
`;

const HostContainer = styled.div`
  gap: 20px;
  font-family: 'Crimson Text', serif;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HostDetails = styled.div`
  padding: 20px 24px;
  justify-content: center;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  font-weight: 700;
  font-family: 'Crimson Text', serif;
  gap: 12px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(248, 244, 249, 0.5) 100%);
  border-radius: 16px;
  border: 1px solid rgba(232, 140, 166, 0.2);
  box-shadow: 0 3px 15px rgba(232, 140, 166, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(232, 140, 166, 0.15);
    border-color: rgba(232, 140, 166, 0.3);
  }
`;

const ParentsInfo = styled.div`
  font-size: 1rem;
  color: #44484d;
  margin-bottom: 4px;
  font-weight: 600;
  font-family: 'Crimson Text', serif;
`;

const RelationshipText = styled.div`
  font-size: 0.9rem;
  color: rgba(68, 72, 77, 0.7);
  font-weight: 500;
  font-style: italic;
  font-family: 'Crimson Text', serif;
`;
