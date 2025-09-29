import { useState } from 'react';

function TestApp() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Test App - Kiểm tra hoạt động</h1>
      <p>Nếu bạn thấy trang này, React đang hoạt động bình thường!</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{ 
          padding: '10px 20px', 
          fontSize: '11.2px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}
      >
        Đã nhấp {count} lần
      </button>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>🔍 Kiểm tra Firebase Config:</h3>
        <p>API Key: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Có' : '❌ Không có'}</p>
        <p>Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Có' : '❌ Không có'}</p>
        <p>Database URL: {import.meta.env.VITE_FIREBASE_DATABASE_URL ? '✅ Có' : '⚠️ Chưa có (cần thiết lập Realtime Database)'}</p>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <p>👉 <strong>Để quay lại ứng dụng chính:</strong> Xóa file src/TestApp.tsx và khôi phục App.tsx</p>
      </div>
    </div>
  );
}

export default TestApp;
