# Kết nối database bằng pgAdmin 4 (an toàn, không lưu secrets)

Mục đích: Hướng dẫn nhanh cách cấu hình pgAdmin để kết nối tới database `lotradwDB` mà KHÔNG lưu mật khẩu vào repo.

---

1) Thông tin cần có (từ bạn / DBA)
- Host: `::1` (IPv6 loopback) hoặc `127.0.0.1` (IPv4)
- Port: `5432`
- Database: `lotradwDB` (hoặc `lotradw` nếu bạn muốn kết nối DB khác)
- Username: `postgres` hoặc `lotradw_app_user` (tuỳ user bạn muốn dùng)
- Password: (không nên commit vào repo)

2) Cách tạo Server trong pgAdmin 4
- Mở pgAdmin → Servers (right-click) → Create → Server...
- Tab "General":
  - Name: `lotradw-local` (hoặc tên bạn muốn)
- Tab "Connection":
  - Host name/address: `::1` (thử `127.0.0.1` nếu không kết nối được)
  - Port: `5432`
  - Maintenance DB / Database: `lotradwDB`
  - Username: `postgres` (hoặc `lotradw_app_user`)
  - Password: nhập mật khẩu (chỉ lưu cục bộ nếu bạn muốn)
  - SSL: mặc định "Prefer"; nếu server yêu cầu SSL, chọn theo cấu hình của DBA
- Click "Save" để thử kết nối.

3) Kiểm tra nhanh sau khi kết nối
Chạy các câu lệnh này trong Query Tool (mỗi câu trả về một result grid):

- Kiểm tra phiên OK

```sql
SELECT 1 AS tx_ok;
```

- Kiểm tra extensions (pgcrypto, uuid-ossp)

```sql
SELECT extname FROM pg_extension WHERE extname IN ('pgcrypto','uuid-ossp');
```

- Chạy file test (đã có trong repo: `TestDB.sql`) — mở file và chạy toàn bộ; kiểm tra các kết quả trả về.

4) Mẫu `pg_service.conf` (không chứa password) — dùng libpq service name
(đặt vào `~/.pg_service.conf` trên máy của bạn; không commit file thật vào repo)

```
# ~/.pg_service.conf
[lotradw-local]
host=::1
port=5432
dbname=lotradwDB
user=postgres
# password=YOUR_PASSWORD_HERE  # DO NOT COMMIT
```

Kết nối bằng service name trong pgAdmin Advanced connection 'Service' hoặc dùng:
`psql service=lotradw-local`

5) Mẫu `.pgpass` (ví dụ) — dùng để lưu password cục bộ (file `~/.pgpass`)
- Định dạng: `hostname:port:database:username:password`
- Quyền file phải là 0600 (chỉ owner đọc/ghi)

```
# ~/.pgpass
::1:5432:lotradwDB:postgres:your_password_here
```

Lưu ý: KHÔNG commit `.pgpass` hoặc file có mật khẩu vào git.

6) Nếu cần bật extension (yêu cầu quyền superuser)
Nếu bạn thiếu `pgcrypto` hoặc `uuid-ossp` và có quyền superuser, chạy:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Nếu bạn không có quyền, yêu cầu DBA chạy giúp.

7) Gợi ý bảo mật
- Tạo một role riêng cho ứng dụng (`lotradw_app_user`) với quyền tối thiểu (không dùng `postgres` cho production).
- Lưu mật khẩu cục bộ (ví dụ `.pgpass`), hoặc sử dụng secret manager khi deploy.

---

Nếu bạn muốn, tôi sẽ thêm một file `pg_service.conf.example` và `.pgpass.example` (mẫu, không chứa password) vào repo. Bạn có muốn tôi tạo thêm 2 file mẫu đó không? Nếu có, trả lời “Có” và tôi sẽ thêm ngay.