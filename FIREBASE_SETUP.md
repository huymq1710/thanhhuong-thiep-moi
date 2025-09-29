# Hướng dẫn thiết lập Firebase cho tính năng gửi lời chúc

## ✅ Bước 1: Cài đặt Firebase (Đã hoàn thành)
```bash
npm install firebase
```

## ✅ Bước 2: Cấu hình Environment Variables (Đã hoàn thành)
File `.env` đã được tạo với Firebase config của bạn.

## 🔧 Bước 3: Thiết lập Realtime Database (CẦN LÀM)
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project "wedding-invitation-a8321"
3. Trong menu bên trái, chọn "Realtime Database"
4. Nhấp "Create Database"
5. Chọn location (khuyến nghị: asia-southeast1 cho Việt Nam)
6. Chọn "Start in test mode" (để dễ dàng test)
7. Nhấp "Enable"

## 🔧 Bước 4: Lấy Database URL
Sau khi tạo Realtime Database, bạn sẽ thấy Database URL có dạng:
```
https://wedding-invitation-a8321-default-rtdb.firebaseio.com/
```

Cập nhật file `.env` với Database URL này:

```env
VITE_FIREBASE_DATABASE_URL=https://wedding-invitation-a8321-default-rtdb.firebaseio.com/
```

## Bước 5: Cấu hình Database Rules (Tùy chọn)
Để bảo mật tốt hơn, trong Firebase Console > Realtime Database > Rules, cập nhật rules:

```json
{
  "rules": {
    "guestbook": {
      ".read": true,
      ".write": true,
      "$messageId": {
        ".validate": "newData.hasChildren(['sender', 'message', 'createdAt', 'date']) && newData.child('sender').isString() && newData.child('message').isString()"
      }
    }
  }
}
```

## Bước 6: Test tính năng
1. Chạy `npm run dev`
2. Cuộn xuống phần "Gửi đến cô dâu chú rể"
3. Điền tên và lời nhắn, nhấp "Đăng ký"
4. Nhấp "🔽 Xem lời chúc đã gửi" để xem lời chúc
5. Hoặc nhấp nút "💌 Lời chúc" ở floating bar để mở trang riêng

## Tính năng đã implement:
✅ Form gửi lời chúc với validation
✅ Lưu lời chúc vào Firebase Realtime Database
✅ Hiển thị danh sách lời chúc trong trang chính (có thể ẩn/hiện)
✅ Trang riêng để xem tất cả lời chúc (mở trong tab mới)
✅ Sắp xếp lời chúc theo thời gian (mới nhất trước)
✅ Responsive design cho mobile và desktop

## Lưu ý:
- Cần cấu hình Firebase config thực tế để tính năng hoạt động
- Database rules có thể cần điều chỉnh tùy theo yêu cầu bảo mật
- Có thể thêm tính năng xóa/chỉnh sửa lời chúc nếu cần
