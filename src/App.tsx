import { useRef } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Heading1 } from '@/components/Text.tsx';
import Wrapper from '@/components/Wrapper.tsx';
import Account from '@/layout/Account/Account.tsx';
import Container from '@/layout/Container.tsx';
import GalleryWrap from '@/layout/Gallery/GalleryWrap.tsx';
import Guestbook from '@/layout/Guestbook/Guestbook.tsx';
import Invitation from '@/layout/Invitation/Invitation.tsx';
import Location from '@/layout/Location/Location.tsx';
import Main from '@/layout/Main/Main.tsx';

function App() {
  const galleryRef = useRef(null);

  return (
    <Container>
      <Wrapper>
        <Main />
      </Wrapper>
      <Wrapper>
        <Heading1 style={{ marginBottom: '24px' }}>Thiệp mời</Heading1>
        <Invitation />
      </Wrapper>
      <Wrapper ref={galleryRef}>
        <Heading1>Ảnh cưới</Heading1>
        <GalleryWrap />
      </Wrapper>
      <Wrapper>
        <Heading1>Nơi gửi tấm lòng</Heading1>
        <Account />
      </Wrapper>
      <Wrapper>
        <Heading1 style={{ marginBottom: '24px' }}>Địa điểm tổ chức</Heading1>
        <Location />
      </Wrapper>
      <Wrapper>
        <Heading1>Gửi đến cô dâu chú rể</Heading1>
        <Guestbook />
      </Wrapper>
      <SpeedInsights />
    </Container>
  );
}

export default App;
