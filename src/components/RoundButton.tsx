import styled from '@emotion/styled';

const RoundButton = styled.button`
  padding: 14px 28px;
  border-radius: 25px;
  outline: none;
  border: none;
  box-shadow: 0 4px 15px rgba(232, 140, 166, 0.3);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  color: white;
  text-decoration: none;
  background: linear-gradient(135deg, #e88ca6 0%, #d678a0 100%);
  font-family: 'Playfair Display', serif;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(232, 140, 166, 0.4);
    background: linear-gradient(135deg, #d678a0 0%, #c26693 100%);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(232, 140, 166, 0.3);
  }
  
  &:before {
    content: '📅';
    font-size: 1.1rem;
  }
`.withComponent('a');

export default RoundButton;
