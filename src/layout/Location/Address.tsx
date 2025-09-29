import styled from '@emotion/styled';
import data from 'data.json';
import { ILocationInfo } from '@/types/data.ts';

const Address = () => {
  const { locationInfo } = data;
  
  const renderTextWithLinks = (text: string) => {
    // Pattern để detect URL với custom text: (URL|text)
    const customLinkRegex = /\((https?:\/\/[^\s|]+)\|([^)]+)\)/g;
    // Pattern để detect URL thông thường
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Xử lý custom links trước
    let processedText = text.replace(customLinkRegex, (_, url, linkText) => {
      return `__CUSTOM_LINK__${url}__TEXT__${linkText}__END__`;
    });
    
    // Sau đó xử lý URL thông thường
    const parts = processedText.split(/(__CUSTOM_LINK__[^_]+__TEXT__[^_]+__END__|https?:\/\/[^\s]+)/);
    
    return parts.map((part, index) => {
      // Xử lý custom link
      if (part.startsWith('__CUSTOM_LINK__')) {
        const matches = part.match(/__CUSTOM_LINK__([^_]+)__TEXT__([^_]+)__END__/);
        if (matches) {
          const [, url, linkText] = matches;
          return (
            <StyledLink 
              key={index} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {linkText}
            </StyledLink>
          );
        }
      }
      
      // Xử lý URL thông thường
      if (urlRegex.test(part)) {
        return (
          <StyledLink 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {part}
          </StyledLink>
        );
      }
      
      return part;
    });
  };

  return (
    <WayWrapper>
      {locationInfo?.map((item: ILocationInfo) => {
        const { title, desc } = item;
        return (
          <Way key={title}>
            <TransportTitle>{title}</TransportTitle>
            <TransportDescription>{renderTextWithLinks(desc)}</TransportDescription>
          </Way>
        );
      })}
    </WayWrapper>
  );
};

export default Address;

const WayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 16px 0;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const Way = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 244, 249, 0.7) 100%);
  border-radius: 16px;
  border: 2px solid rgba(232, 140, 166, 0.2);
  box-shadow: 0 4px 15px rgba(232, 140, 166, 0.1);
  transition: all 0.3s ease;
  gap: 12px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(232, 140, 166, 0.2);
    border-color: rgba(232, 140, 166, 0.4);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #e88ca6, #d678a0);
    opacity: 0.6;
  }
`;

const TransportTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 0.77rem;
  font-weight: 600;
  color: #e88ca6;
  margin: 0 0 8px 0;
  padding-left: 8px;
  position: relative;
  line-height: 1.3;
  
  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 20px;
    background: linear-gradient(180deg, #e88ca6, #d678a0);
    border-radius: 2px;
  }
`;

const TransportDescription = styled.div`
  font-family: 'Crimson Text', serif;
  font-size: 0.665rem;
  line-height: 1.6;
  color: #44484d;
  margin: 0;
  padding-left: 8px;
  white-space: pre-line;
  word-break: break-word;
  overflow-wrap: break-word;
`;

const StyledLink = styled.a`
  color: #e88ca6;
  text-decoration: underline;
  font-weight: 600;
  transition: all 0.3s ease;
  word-break: break-all;
  
  &:hover {
    color: #d678a0;
    text-decoration: none;
    text-shadow: 0 1px 3px rgba(232, 140, 166, 0.3);
  }
  
  &:visited {
    color: #c26693;
  }
`;
