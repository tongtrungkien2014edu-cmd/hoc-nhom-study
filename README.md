# HỌC NHÓM STUDY

Nền tảng học nhóm trực tuyến dành cho giáo viên và học sinh, xây dựng bằng **React + Vite (JavaScript)** và **Firebase thật** (Authentication, Firestore, Realtime Database). Tài liệu được chia sẻ bằng link Google Drive, không dùng Firebase Storage.

> **Lưu ý quan trọng:** mã nguồn không kèm API key. Khi chưa có `.env`, ứng dụng hiển thị màn hình hướng dẫn cấu hình thay vì dùng dữ liệu giả.

---

## 1. Chức năng

- Đăng nhập bằng email/mật khẩu hoặc Google (Gmail), có bước xác minh người dùng; đăng ký, quên mật khẩu, đổi mật khẩu (Firebase Authentication).
- Tài khoản Google đăng nhập lần đầu được tạo với vai trò **Học sinh**.
- Phân quyền **Quản trị viên / Giáo viên / Học sinh**; không cho tự đăng ký quyền admin.
- Tài khoản tự đăng ký (học sinh và giáo viên) được kích hoạt ngay với `status: "active"`, không cần quản trị viên duyệt.
- Dashboard riêng cho giáo viên và học sinh, số liệu đọc trực tiếp từ Firestore.
- Nhóm học: tạo/sửa/xóa, mã mời + link mời, thành viên, xóa học sinh khỏi nhóm.
- Phòng học online: danh sách thành viên, trạng thái online, bảng trắng đồng bộ (bút, tẩy, màu, độ đậm, hoàn tác, xóa bảng) và chat nhóm.
- Chat nhóm và chat riêng giáo viên – học sinh, cập nhật thời gian thực.
- Tài liệu: lưu tiêu đề, mô tả, môn học và link Google Drive.
- Bài tập: giao bài, hạn nộp, đính kèm link Drive; học sinh nộp bài bằng nội dung hoặc link Drive.
- Bài nộp: giáo viên xem, chấm điểm 0–10, nhận xét; học sinh xem kết quả.
- Lịch học: xem theo tuần/tháng, thêm link Google Meet/Zoom/Teams, thông báo cho học sinh.
- Thông báo trong ứng dụng: bài tập, bài nộp, điểm, lịch học, tài khoản.
- Hồ sơ cá nhân và cài đặt bảo mật.
- Quản trị: khóa/mở khóa tài khoản, đổi vai trò, quản lý nhóm, kiểm tra nội dung và báo cáo.

---

## 2. Công nghệ

| Thành phần | Công nghệ |
| --- | --- |
| Giao diện | React 18, Vite 6, Tailwind CSS 3, Lucide Icons, Framer Motion |
| Ngôn ngữ | JavaScript (JSX) |
| Xác thực | Firebase Authentication (Email/Password + Google) |
| Dữ liệu | Cloud Firestore |
| Thời gian thực | Firebase Realtime Database (presence + bảng trắng) |
| Tài liệu | Link Google Drive do người dùng dán |

---

## 3. Yêu cầu môi trường

- Node.js 18 trở lên (khuyến nghị 20/22).
- npm 9 trở lên.
- Một dự án Firebase (hướng dẫn bên dưới dùng project id `hoc-nhom-study`).
- Firebase CLI nếu muốn triển khai quy tắc/hosting: `npm i -g firebase-tools`.

---

## 4. Cài đặt

```bash
npm install
cp .env.example .env   # Windows Git Bash; hoặc tạo tệp .env thủ công
npm run dev
```

Mặc định Vite chạy tại `http://localhost:5173`.

### Biến môi trường

Tạo tệp `.env` ở thư mục gốc:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=hoc-nhom-study.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hoc-nhom-study
VITE_FIREBASE_STORAGE_BUCKET=hoc-nhom-study.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_DATABASE_URL=https://hoc-nhom-study-default-rtdb.asia-southeast1.firebasedatabase.app
```

Lấy các giá trị tại **Firebase Console → Project settings → General → Your apps → Web app → SDK setup and configuration → Config**. URL Realtime Database lấy tại **Realtime Database → Data**; với dự án này là khu vực `asia-southeast1`.

Dự án đã có sẵn `.env` với project id, auth domain, bucket và database URL đúng. Bạn chỉ cần bổ sung `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_MESSAGING_SENDER_ID` và `VITE_FIREBASE_APP_ID`. Nếu `.env` chưa tồn tại (ví dụ sau khi clone), sao chép từ `.env.example`.

Cấu hình web của Firebase là thông tin công khai; **không** đặt Service Account Private Key trong dự án React.

---

## 5. Thiết lập Firebase

1. Tạo dự án Firebase (hoặc dùng dự án `hoc-nhom-study` đã có).
2. **Authentication** → Sign-in method → bật **Email/Password** và **Google** (chọn support email). Thêm domain chạy thật vào **Authorized domains**; `localhost` thường đã có sẵn cho môi trường phát triển.
3. **Firestore Database** → Create database → chọn khu vực → bắt đầu ở chế độ production.
4. **Realtime Database** → Create database → chọn khu vực → bắt đầu ở chế độ locked.
5. Tạo Web app trong Project settings để lấy cấu hình và điền `.env`.

### Triển khai quy tắc bảo mật & chỉ mục

```bash
firebase login
firebase use hoc-nhom-study
firebase deploy --only firestore:rules,firestore:indexes,database
```

- `firestore.rules`: chỉ người đã đăng nhập và đúng vai trò/thành viên nhóm mới đọc/ghi; admin toàn quyền; `inviteCodes` chỉ đọc bằng mã (không liệt kê).
- `database.rules.json`: chỉ tài khoản đã đăng nhập mới ghi `status` và phòng học.
- `firestore.indexes.json`: chỉ mục cho chat trực tiếp, chat nhóm và thông báo. Nếu Firestore báo thiếu index, mở link trong thông báo lỗi của trình duyệt để tạo.

### Tạo tài khoản quản trị đầu tiên

Ứng dụng **không cho tự đăng ký admin** và không hardcode mật khẩu. Quy trình an toàn dùng Firebase Admin SDK trên máy chủ:

1. Bật **Authentication → Sign-in method → Email/Password**.
2. Tạo tài khoản `tongk25011999@gmail.com` tại `/dang-ky` hoặc Firebase Console → Authentication → Add user. Đặt mật khẩu mạnh; không ghi mật khẩu vào mã nguồn hay Firestore.
3. Vào **Firebase Console → Project settings → Service accounts → Generate new private key**, tải file JSON và lưu vào `secrets/firebase-service-account.json` (thư mục này đã được gitignore).
4. Trong `.env`, đặt:
   ```env
   ADMIN_EMAIL=tongk25011999@gmail.com
   GOOGLE_APPLICATION_CREDENTIALS=./secrets/firebase-service-account.json
   ```
5. Chạy:
   ```bash
   npm run set-admin
   ```
   Script chỉ đặt `role: "admin"`, `status: "active"`, `approved: true` cho đúng UID; không tạo mật khẩu và không lưu mật khẩu.
6. Đăng nhập tại `/admin/login`. Hệ thống kiểm tra lại role/status trong Firestore trước khi cho vào dashboard.

Sau đó dùng **Admin → Tài khoản** để phân quyền, khóa/mở khóa hoặc xóa tài khoản. Không thể hạ quyền/xóa admin cuối cùng.

### Quy trình đăng ký tài khoản

1. Học sinh hoặc giáo viên đăng ký trên website → hồ sơ được tạo trong `users` với `status: "active"`.
2. Tài khoản được đăng nhập tự động và chuyển đến `/dashboard` (giáo viên có thể tạo nhóm ngay).
3. Không có màn hình chờ duyệt và không cần thao tác của quản trị viên.
4. Quản trị viên vẫn có thể khóa tài khoản; tài khoản bị khóa sẽ bị đăng xuất và bị quy tắc Firestore từ chối truy cập.

---

## 6. Cấu trúc dữ liệu Firestore

| Collection | Nội dung chính |
| --- | --- |
| `users` | `uid`, `name`, `email`, `role`, `status`, `approved`, môn học, hồ sơ |
| `groups` | Tên nhóm, môn, màu, giáo viên, `inviteCode`, `boardKey` |
| `groupMembers` | Mỗi thành viên một document `${groupId}_${uid}` |
| `messages` | Chat nhóm (`type: group`) và chat riêng (`type: direct`, `participants`, `conversationId`) |
| `materials` | Tiêu đề, mô tả, môn, `driveLink`, người tạo |
| `assignments` | Tiêu đề, mô tả, hạn nộp, link đính kèm |
| `submissions` | Bài làm, link Drive, điểm, nhận xét; id `${assignmentId}_${uid}` |
| `schedules` | Ngày, giờ bắt đầu/kết thúc, ghi chú, link phòng học ngoài |
| `notifications` | Thông báo theo `userId`, `type`, `read`, `link` |
| `inviteCodes` | Ánh xạ mã mời → `groupId` (chỉ đọc bằng `get`, không liệt kê) |
| `classes` | Lớp do Admin quản lý: tên, mã, môn, giáo viên phụ trách |
| `classMembers` | Thành viên lớp, id `${classId}_${uid}` |
| `subjects` | Môn học do Admin quản lý |
| `lessons` | Bài học gắn với môn học |
| `activityLogs` | Nhật ký thao tác quản trị, chỉ Admin đọc/ghi |

Realtime Database:

```text
status/{uid}                                  → trạng thái online toàn cục
rooms/{boardKey}/presence/{uid}               → người đang trong phòng
rooms/{boardKey}/strokes/{strokeId}           → nét vẽ bảng trắng
```

`boardKey` là chuỗi ngẫu nhiên lưu trong document nhóm, đóng vai trò "khóa phòng" để tránh đoán đường dẫn.

---

## 7. Tài liệu Google Drive

Thư mục Drive dùng chung của lớp:

**https://drive.google.com/drive/folders/1W_LeABFTKEToD-sPs6iHFr6tpapaARLP?usp=drive_link**

Ứng dụng **không tải tệp lên Firebase Storage** và chưa tích hợp Google Drive API/OAuth, nên **không tự động liệt kê file** trong thư mục. Nút **Thư mục Drive** chỉ mở thư mục gốc trên tab mới. Giáo viên:

1. Tải tệp lên thư mục Drive ở trên (hoặc thư mục con).
2. Bật chia sẻ **“Bất kỳ ai có liên kết”** cho tệp/thư mục để học sinh mở được.
3. Sao chép link và dán vào mục **Tài liệu** hoặc **Bài tập** để lưu vào Firestore.

Nếu link không mở được với học sinh, kiểm tra lại quyền chia sẻ của tệp trên Drive. Muốn tự động đọc/liệt kê thư mục, cần bổ sung Google Drive API + OAuth ở phía máy chủ; hiện tại chưa làm để tránh lộ khóa.

---

## 8. Scripts

```bash
npm run dev        # chạy môi trường phát triển
npm run build      # build production vào dist/
npm run preview    # xem thử bản build
npm run set-admin  # cấp quyền admin đầu tiên bằng Firebase Admin SDK
```

Triển khai Firebase Hosting:

```bash
npm run build
firebase deploy --only hosting
```

Có thể triển khai frontend lên Vercel/Netlify; nhớ thêm các biến `VITE_FIREBASE_*` trong phần Environment Variables của dịch vụ.

---

## 9. Bảo mật & giới hạn đã biết

- Dự án dùng **Firebase Authentication + Firestore + Firebase Security Rules**, không dùng Supabase/RLS. Vì vậy các yêu cầu về Supabase Auth/Database/RLS được áp dụng tương đương trên Firebase.
- Vì đã bỏ hoàn toàn duyệt tài khoản, người tự đăng ký có thể chọn vai trò **Giáo viên** và tạo nhóm ngay. Nếu cần hạn chế quyền này, phải thêm quy trình xác minh riêng; hiện tại chỉ quyền **Admin** là không thể tự đăng ký.
- Quy tắc Firestore/RTDB là lớp bảo vệ chính. **Bắt buộc triển khai** trước khi dùng thật.
- Xóa tài khoản Firebase Authentication được thực hiện qua **Netlify Function** `admin-delete-user`, dùng Firebase Admin SDK và xác minh ID token của admin gọi API. Không đưa Service Account xuống frontend. Nếu chưa cấu hình `FIREBASE_SERVICE_ACCOUNT`, chức năng xóa sẽ báo lỗi và không xóa dở dang.
- Phòng học không có camera/micro. Muốn gọi video, giáo viên thêm link Google Meet/Zoom/Teams vào buổi học.
- Thông báo chỉ hiển thị trong ứng dụng; chưa gửi email/push vì chưa cấu hình dịch vụ ngoài.
- Chat và bảng trắng cần bật Realtime Database đúng URL; nếu sai `VITE_FIREBASE_DATABASE_URL`, nét vẽ và trạng thái online sẽ không đồng bộ.
- Direct chat cần composite index trong `firestore.indexes.json`; Firestore sẽ nhắc tạo nếu chưa deploy.
- Ứng dụng chưa có chức năng upload tệp, thanh toán hay gửi email.
- Captcha hiện là phép tính đơn giản chạy phía trình duyệt, chỉ giúp hạn chế đăng nhập tự động cơ bản; không phải captcha chống bot chuyên dụng. Muốn bảo vệ mạnh hơn, cần tích hợp reCAPTCHA/Turnstile và xác minh ở máy chủ.
- Đăng nhập Google cần bật provider **Google** trong Firebase Console và thêm domain vào **Authorized domains**; nếu chưa bật, nút Google sẽ báo lỗi `auth/operation-not-allowed`.
- Nếu đăng ký xong nhưng tải lại trang bị mất hồ sơ hoặc trình duyệt báo Firestore `client is offline`, kiểm tra **Firestore Database đã được tạo trong đúng project** và rules đã deploy. Khi Firestore chưa sẵn sàng, SDK có thể chỉ ghi vào cache cục bộ.

---

## 10. Kiểm tra nhanh sau khi cấu hình

1. Đăng ký học sinh → tự động vào `/dashboard` → vào `/nhom` nhập mã mời.
2. Đăng ký giáo viên → tự động vào `/dashboard` → tạo nhóm, mời học sinh, giao bài.
3. Hai trình duyệt/thiết bị đăng nhập hai tài khoản:
   - kiểm tra chat nhóm cập nhật tức thời;
   - mở cùng phòng học, vẽ thử và kiểm tra nét vẽ đồng bộ;
   - kiểm tra trạng thái online.
4. Học sinh nộp bài → giáo viên chấm điểm → học sinh nhận thông báo và xem điểm.
5. Admin khóa một tài khoản → tài khoản đó bị đăng xuất và không đăng nhập lại được.
6. Mở `/admin/login`, đăng nhập bằng tài khoản đã cấp admin → vào `/admin/dashboard`; dùng một tài khoản học sinh đăng nhập cổng admin → bị từ chối và đăng xuất.
7. Trong Admin, tạo lớp, thêm thành viên, tạo môn/bài học, gửi thông báo, khóa/mở khóa tài khoản và kiểm tra **Nhật ký hoạt động**.

Nếu gặp lỗi “Missing or insufficient permissions”, kiểm tra lại `firestore.rules` đã deploy và document `users/{uid}` có đúng `role`/`status`.

Nếu `/admin/login` báo không đọc được hồ sơ, kiểm tra Firestore Database đã tồn tại, rules đã deploy và tài khoản admin đã được cấp bằng `npm run set-admin`.

---

## 11. Hệ thống Admin

### Đường dẫn

| Đường dẫn | Chức năng |
| --- | --- |
| `/admin/login` | Đăng nhập quản trị riêng, hiện/ẩn mật khẩu, báo lỗi sai quyền |
| `/admin/dashboard` | Tổng quan số học sinh, lớp, nhóm, bài tập, bài kiểm tra và biểu đồ 7 ngày |
| `/admin/dashboard/nguoi-dung` | Tìm kiếm, xem/sửa hồ sơ, phân quyền, khóa/mở khóa, xóa tài khoản |
| `/admin/dashboard/lop` | Tạo/sửa/xóa lớp, thêm/xóa thành viên lớp |
| `/admin/dashboard/hoc-tap` | Môn học, bài học, bài tập, đề thi, điểm số, thời khóa biểu, tài liệu |
| `/admin/dashboard/he-thong` | Gửi thông báo, quản lý nhóm, tin nhắn, phân quyền |
| `/admin/dashboard/nhat-ky` | Nhật ký thao tác quản trị |

### Bảo mật Admin

- Route admin được bảo vệ bởi `AdminProtected`; người không phải admin bị chuyển về `/dashboard`, chưa đăng nhập bị chuyển về `/admin/login`.
- Firestore Rules kiểm tra `role == "admin"` và `status` hoạt động ở phía máy chủ cho `classes`, `classMembers`, `subjects`, `lessons`, `activityLogs` và toàn bộ dữ liệu quản trị.
- `admin-delete-user` xác minh ID token, kiểm tra role admin trong Firestore, chặn tự xóa và bảo vệ admin cuối cùng.
- Không có route đăng ký admin công khai; không có mật khẩu trong mã nguồn/Firestore.

### Biến môi trường Netlify

Thêm các biến sau trong **Netlify → Site configuration → Environment variables**:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=hoc-nhom-study.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hoc-nhom-study
VITE_FIREBASE_STORAGE_BUCKET=hoc-nhom-study.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_DATABASE_URL=https://hoc-nhom-study-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_ADMIN_EMAIL=tongk25011999@gmail.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

`FIREBASE_SERVICE_ACCOUNT` là toàn bộ JSON service account trên **một dòng** (hoặc chuỗi base64). Đây là biến server-only, tuyệt đối không đặt tiền tố `VITE_` và không commit vào dự án.

### Triển khai Netlify

```bash
npm run build
# Kết nối repository với Netlify hoặc chạy:
netlify deploy --prod
```

`netlify.toml` đã cấu hình build `dist`, thư mục functions `netlify/functions` và SPA fallback. Sau khi deploy, mở `/admin/login` trên domain Netlify để kiểm tra.

### Lưu ý dữ liệu

- `classes`, `classMembers`, `subjects`, `lessons`, `activityLogs` là collection mới, không trùng collection cũ.
- Admin không tạo bảng Supabase vì dự án hiện dùng Firebase; yêu cầu tương đương được bảo vệ bằng Firestore Rules.
- Xóa tài khoản qua giao diện sẽ xóa Auth, hồ sơ `users`, tư cách thành viên nhóm/lớp; không xóa nhóm học hay bài nộp của người khác.

## Triển khai Cloudflare Pages

### 1. Cấu hình build trên Cloudflare

Vào **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**, chọn repository của dự án, sau đó điền:

| Trường | Giá trị |
| --- | --- |
| Framework preset | `React (Vite)` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` |
| Root directory | `/` (giữ trống nếu repo là chính dự án) |

`vite.config.js` dùng đường dẫn tương đối nên không cần cấu hình `base` riêng. `public/_redirects` đã chứa:

```text
/* /index.html 200
```

File này được Cloudflare Pages đọc tự động, cho phép mở trực tiếp `/groups`, `/assignments`, `/thanh-tich`, `/achievements`, `/admin/dashboard` mà không bị 404 khi tải lại trang.

### 2. Environment Variables

Trong **Cloudflare Pages → Settings → Environment variables**, thêm cho cả **Production** và **Preview** (đây là biến build-time của Vite, phải có trước khi build):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=hoc-nhom-study.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hoc-nhom-study
VITE_FIREBASE_STORAGE_BUCKET=hoc-nhom-study.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_DATABASE_URL=https://hoc-nhom-study-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_ADMIN_EMAIL=tongk25011999@gmail.com
```

Lấy các giá trị này từ **Firebase Console → Project settings → General → Your apps → Web app**. Sau khi thêm biến, chọn **Retry deployment** để Vite nhúng biến vào bundle.

- Chỉ biến có tiền tố `VITE_` mới được đưa vào trình duyệt. Không đặt Service Account, private key hay mật khẩu trong biến `VITE_*`.
- Không commit `.env` lên GitHub (đã có trong `.gitignore`).
- Nếu quên biến, website hiển thị màn hình “Chưa có cấu hình Firebase” kèm danh sách biến còn thiếu thay vì trắng trang.

### 3. Firebase Authorized domains

Sau khi Cloudflare cấp domain (`https://<project>.pages.dev`), vào **Firebase Console → Authentication → Settings → Authorized domains** và thêm domain đó (và domain riêng nếu có). Thiếu bước này, đăng nhập Google/Email trên domain mới sẽ bị chặn.

### 4. Giới hạn cần biết

- `netlify/functions/admin-delete-user.js` chỉ chạy trên Netlify. Cloudflare Pages mặc định không chạy function Node này; chức năng xóa tài khoản Auth cần một Worker/API riêng có Firebase Admin SDK. Các chức năng còn lại (nhóm, lớp, bài tập, chấm điểm, thành tích, admin) chạy hoàn toàn bằng Firebase SDK phía client + Firestore Rules.
- Firestore Rules phải được deploy bằng Firebase CLI (`firebase deploy --only firestore:rules`) sau khi đăng nhập đúng tài khoản có quyền trên project `hoc-nhom-study`.

### 5. Kiểm tra sau khi lên mạng

1. Mở `/` và `/dashboard`, đăng ký/đăng nhập một tài khoản thử.
2. Mở `/groups`, `/assignments`, `/achievements`, `/admin/dashboard` rồi tải lại (F5) — không được 404.
3. Tạo nhóm, lấy mã mời, dùng tài khoản học sinh tham gia bằng `/tham-gia/<MÃ>`.
4. Gửi tin nhắn trong nhóm ở hai cửa sổ để kiểm tra realtime.
5. Giao bài, nộp bài, chấm điểm và xem lại ở trang Thành tích.
6. Đăng nhập `/admin/login` bằng tài khoản admin; tài khoản học sinh phải bị chặn khỏi khu vực admin.
7. Bật/tắt chế độ tối ở góc phải header; tải lại trang để kiểm tra lưu lựa chọn.

## Giao diện & tính năng mới

- **Chế độ sáng/tối**: `src/context/ThemeContext.jsx`, lưu lựa chọn trong `localStorage`, tôn trọng `prefers-color-scheme` lần đầu truy cập. Nút chuyển nằm ở header người dùng và header admin.
- **Trang Thành tích**: `/thanh-tich` (alias `/achievements`) — điểm trung bình, xếp loại, biểu đồ tiến độ, lịch sử, huy hiệu, thống kê theo môn; giáo viên thấy bảng xếp hạng học sinh trong nhóm.
- **Trạng thái lớp học**: `scheduled`, `live`, `completed`, `cancelled` được lưu trong `schedules.status`, chọn khi tạo/sửa lịch và hiển thị badge trong Lịch học và Phòng học.
- **Alias đường dẫn**: `/groups` → Nhóm học, `/assignments` → Bài tập.
