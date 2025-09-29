import styled from '@emotion/styled';

export const Heading1 = styled.p`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  margin: 10px;
  color: #e88ca6;
  white-space: pre-line;
  font-weight: 600;
  line-height: 1.3;
  
  /* Mobile responsive - tăng font size và điều chỉnh để tránh xuống dòng không mong muốn */
  @media (max-width: 768px) {
    font-size: 1.35rem;
    margin: 8px 0;
    padding: 0 10px;
    /* Cho phép từ được chia nếu quá dài */
    word-break: keep-all;
    overflow-wrap: break-word;
    hyphens: auto;
    /* Điều chỉnh line-height để text gần nhau hơn khi xuống dòng */
    line-height: 1.2;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin: 6px 0;
    padding: 0 8px;
  }
  
  @media (max-width: 360px) {
    font-size: 1.15rem;
    padding: 0 5px;
  }
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
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    font-size: 1.05rem;
    margin: 0 0 6px 0;
    /* Tránh xuống dòng không mong muốn */
    word-break: keep-all;
    overflow-wrap: break-word;
    hyphens: auto;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin: 0 0 5px 0;
  }
  
  @media (max-width: 360px) {
    font-size: 0.95rem;
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
  
  /* Mobile responsive - tối ưu hiển thị văn bản dài */
  @media (max-width: 768px) {
    padding: 16px 12px;
    margin: 12px 8px;
    font-size: 0.95rem;
    line-height: 1.7rem;
    /* Đảm bảo văn bản không bị cắt xấu */
    word-break: keep-all;
    overflow-wrap: break-word;
    hyphens: auto;
  }
  
  @media (max-width: 480px) {
    padding: 14px 10px;
    margin: 10px 5px;
    font-size: 0.9rem;
    line-height: 1.6rem;
  }
  
  @media (max-width: 360px) {
    padding: 12px 8px;
    margin: 8px 4px;
    font-size: 0.85rem;
    line-height: 1.5rem;
  }
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
