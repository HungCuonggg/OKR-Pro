# Nhóm Thay đổi & Nâng cấp (so với bản gốc OKR-Project)

Tài liệu này ghi nhận các phần đã được chỉnh sửa, thêm mới và tái cấu trúc so với mã nguồn gốc từ `TranVanQuang040/OKR-Project`.

## 1. Tái cấu trúc Thư mục (Folder Restructuring)
- **Thay đổi**: Toàn bộ mã nguồn cũ (trực thuộc root) đã được đưa vào thư mục `/server`.
- **Lý do**: Để chuẩn bị cho việc triển khai (deployment) gọn gàng hơn, tách biệt rõ ràng giữa Backend và các tệp cấu hình môi trường.

## 2. Nâng cấp Dashboard (Premium & Interactive)
- **Nguyên bản**: Một biểu đồ cột đơn giản hiển thị tiến độ theo phòng ban và thống kê % cơ bản.
- **Bản nâng cấp (Tại nhánh dashbroad)**:
    - **Hệ thống Cảnh báo Thông minh (Smart Alerts)**: Tự động phân loại nhiệm vụ theo quy tắc 3-7-12 ngày (Sắp hết hạn, Chưa làm quá hạn...).
    - **Biểu đồ Vòng (Radial Chart) & Drill-down**: Cho phép nhấp vào từng phòng ban để xem chi tiết tiến độ ngay tại chỗ không cần tải lại trang.
    - **Bảng Điều khiển Cảnh báo (Alert Board)**: Hiển thị danh sách các đầu việc khẩn cấp nhất với lý do cảnh báo cụ thể.
    - **Thiết kế**: Áp dụng ngôn ngữ thiết kế Premium (Rounded 2.5rem, Shadows, Gradients).

## 3. Quản lý Công việc & Lịch (Task Scheduling)
- **Nguyên bản**: Không có bộ chọn ngày (Date Picker) trong form giao việc, ngày hạn phải nhập tay hoặc để trống.
- **Bản nâng cấp**:
    - Tích hợp **Lịch (Date Picker)** vào form Giao việc mới và Chỉnh sửa.
    - Hiển thị ngày hạn trực quan trên từng thẻ công việc.
    - Liên kết ngày hạn trực tiếp với logic cảnh báo trên Dashboard.

## 4. Cải thiện Logic & Fix Bugs
- **Fix trạng thái**: Chỉnh sửa logic đếm công việc từ `DOING` (không tồn tại trong schema) sang `IN_PROGRESS` để số liệu Dashboard chính xác 100%.
- **Fix Caching**: Hướng dẫn và xử lý vấn đề cache trình duyệt để luôn hiển thị mã mới nhất sau khi build.

## 5. Tài liệu & Quy trình (Documentation)
- Thêm tệp `walkthrough.md` giải thích chi tiết logic "dưới nắp máy".
- Cấu hình lại `.gitignore` chuyên nghiệp hơn.
