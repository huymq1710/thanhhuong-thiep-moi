const GoogleMap = () => {
  return (
    <div 
      style={{ 
        width: '100%', 
        height: '250px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(232, 140, 166, 0.2)',
        border: '2px solid rgba(232, 140, 166, 0.2)',
        position: 'relative'
      }}
    >
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3133.891919356294!2d106.56977454649413!3d20.918491724280248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a791a7df12f6b%3A0x5a33c5c59db98031!2zTmjDoCBWxINuIEjDs2EgVOG7lSBkw6JuIHBo4buRIFTDom4gVGhhbmg!5e0!3m2!1sen!2s!4v1759119577621!5m2!1sen!2s"
        width="100%"
        height="100%"
        style={{ border: 0, borderRadius: '14px' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Nhà văn hoá Tân Thanh, Hồng An, Hải Phòng - Địa điểm tổ chức lễ cưới"
      />
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '6px 10px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontFamily: 'Crimson Text, serif',
        color: '#44484d',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(232, 140, 166, 0.3)',
        boxShadow: '0 2px 8px rgba(232, 140, 166, 0.2)'
      }}>
      </div>
    </div>
  );
};

export default GoogleMap;
