# Environment Variables Setup

## Tạo file .env

Tạo file `.env` trong thư mục `frontend/` với nội dung sau:

```env
# API Configuration
VITE_API_URL=http://localhost:4000/api

# Environment
VITE_ENV=development
```

## Giải thích

- `VITE_API_URL`: URL của backend API. Mặc định là `http://localhost:4000/api`
- `VITE_ENV`: Môi trường chạy ứng dụng (`development` hoặc `production`)

## Lưu ý

- File `.env` đã được thêm vào `.gitignore` và sẽ không được commit lên git
- Trong Vite, các biến môi trường phải bắt đầu bằng `VITE_` để được expose ra client
- Sau khi thay đổi `.env`, cần restart dev server

## Production

Khi deploy lên production, tạo file `.env.production`:

```env
VITE_API_URL=https://your-api-domain.com/api
VITE_ENV=production
```

