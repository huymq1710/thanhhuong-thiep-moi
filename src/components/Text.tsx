import styled from '@emotion/styled';

export const Heading1 = styled.p`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  margin: 10px;
  color: #e88ca6;
  white-space: pre-line;
  font-weight: 600;
`;

export const Heading2 = styled.p`
  font-family: 'Crimson Text', serif;
  font-size: 1rem;
  margin: 10px;
  white-space: pre-line;
`;

export const PointTitle = styled.p`
  font-family: 'Playfair Display', serif;
  line-height: 1.2;
  margin: 0 0 8px 0;
  color: #e88ca6;
  white-space: pre-line;
  font-weight: 600;
  font-size: 1.1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 30px;
    height: 2px;
    background: linear-gradient(90deg, #e88ca6, transparent);
    border-radius: 1px;
  }
`;

export const Paragraph = styled.p`
  font-family: 'Crimson Text', serif;
  line-height: 2rem;
  white-space: pre-line;
  color: #44484d;
  text-align: center;
  margin: 16px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(232, 140, 166, 0.1);
`;

export const Caption = styled.p<{ textAlign?: string }>`
  font-family: 'Crimson Text', serif;
  font-weight: 400;
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'start')};
  white-space: pre-line;
  color: #44484d;
  line-height: 1.6;
  margin: 8px 0;
`;
