# Danh sách Thay đổi Chi tiết (so với bản gốc OKR-Project)

Tài liệu này liệt kê chính xác các tệp tin đã được chỉnh sửa, thêm mới và logic thay đổi cụ thể để đồng nghiệp dễ dàng theo dõi.

---

## 📂 1. Thay đổi Cấu trúc Thư mục & Hệ thống
- **Tệp tin**: `/.gitignore` (Mới)
    - **Nội dung**: Thêm cấu hình loại bỏ `node_modules`, `dist`, `.env` và các tệp rác hệ thống để giữ repository sạch sẽ.
- **Tệp tin**: `/CHANGELOG.md` (Mới)
    - **Nội dung**: Ghi nhận lịch sử nâng cấp dự án.
- **Tệp tin**: `/server/` (Tái cấu trúc)
    - **Nội dung**: Toàn bộ mã nguồn backend và frontend được tổ chức lại bên trong thư mục này.

---

## 📊 2. Nâng cấp Giao diện Dashboard
- **Tệp tin**: `d:\OKR-Project-main\server\client\pages\Dashboard.tsx` (Chỉnh sửa lớn)
    - **Nâng cấp**:
        - Tích hợp thư viện `recharts` với các biểu đồ `PieChart` (Trạng thái) và `RadialBarChart` (Tiến độ).
        - **Logic Cảnh báo Thông minh**: Thêm hàm `taskAnalysis` để tự động đếm nhiệm vụ theo quy tắc 3-7-12 ngày.
        - **Tính năng Drill-down**: Thêm `focusDept` để xem chi tiết tiến độ từng phòng ban mà không cần tải lại trang.
        - **Bảng Cảnh báo**: Thêm giao diện danh sách nhiệm vụ khẩn cấp (`alertTasks`) hiển thị kèm lý do cảnh báo chi tiết.
        - **Giao diện**: Áp dụng thiết kế bo góc `rounded-[2.5rem]` và dải màu Gradient.

---

## 📝 3. Quản lý Nhiệm vụ & Lịch hạn
- **Tệp tin**: `d:\OKR-Project-main\server\client\pages\Tasks.tsx` (Chỉnh sửa)
    - **Nâng cấp**:
        - **Thêm Lịch (Date Picker)**: Chỉnh sửa `formData` và form trong Modal để tích hợp `<input type="date" />`.
        - **Hiển thị Ngày hạn**: Cập nhật giao diện thẻ nhiệm vụ (`task card`) để hiển thị ngày `dueDate` kèm icon lịch.
        - **Đồng bộ**: Đảm bảo ngày hạn được lưu xuống Database để Dashboard có thể tính toán cảnh báo.

---

## 🛠️ 4. Sửa lỗi & Tối ưu hóa
- **Tệp tin**: `d:\OKR-Project-main\server\client\pages\Dashboard.tsx`
    - **Fix Bug**: Thay đổi logic lọc trạng thái từ `DOING` (mã cũ không chạy) sang `IN_PROGRESS` (đúng chuẩn schema).
- **Tệp tin**: `d:\OKR-Project-main\server\client\services\taskService.ts` (Tham chiếu)
    - **Đồng bộ**: Đảm bảo các hàm gọi API tương thích với dữ liệu ngày tháng mới.

---
*Ghi chú: Toàn bộ các thay đổi trên hiện đang nằm trên nhánh `dashbroad`.*
