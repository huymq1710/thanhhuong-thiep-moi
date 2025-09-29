import styled from '@emotion/styled';

const Button = styled.button`
  font-family: 'Crimson Text', serif;
  padding: 12px 20px;
  border-radius: 20px;
  border: 2px solid rgba(232, 140, 166, 0.3);
  outline: none;
  box-shadow: 0 3px 12px rgba(232, 140, 166, 0.2);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 244, 249, 0.9) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #44484d;
  text-decoration: none;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(232, 140, 166, 0.3);
    border-color: rgba(232, 140, 166, 0.5);
    background: linear-gradient(135deg, #ffeef5 0%, #f8f4f9 100%);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(232, 140, 166, 0.2);
  }
  
  &:before {
    content: '🗺️';
    font-size: 1.1rem;
  }
`.withComponent('a');

export default Button;
