# URL Shortener

Hệ thống rút gọn URL hiện đại, nhanh chóng và bảo mật (giống Bitly). Xây dựng với Node.js, Express, PostgreSQL, Redis và React.

## Công nghệ sử dụng

### Backend
- **Node.js** (v22+) - Runtime environment
- **Express 5** - Web framework
- **PostgreSQL** - Database lưu trữ URLs và analytics
- **Redis** - Cache layer cho redirect nhanh
- **nanoid** - Tạo short code
- **ua-parser-js** - Parse User-Agent
- **geoip-lite** - Tra cứu vị trí từ IP
- **Joi** - Validation
- **Helmet** - Bảo mật HTTP headers
- **express-rate-limit** - Rate limiting

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Axios** - HTTP client
- **Inter Font** - Typography (theo design system Notion-style)

## Cấu trúc dự án

```
url-shortener/
├── .env                    # Biến môi trường (không commit)
├── .env.example             # Mẫu cấu hình
├── .gitignore               # Git ignore rules
├── README.md                # Tài liệu này
├── package.json             # Backend dependencies
├── database/                # Database schemas
│   ├── schema.sql                     # Schema chính
│   └── migration_add_analytics_columns.sql  # Migration
├── src/                     # Backend source code
│   ├── config/
│   │   ├── database.js                 # PostgreSQL connection pool
│   │   └── redis.js                     # Redis client
│   ├── controllers/
│   │   └── url.controller.js          # Request handlers
│   ├── jobs/
│   │   └── cleanup.js                  # Cron job xóa expired URLs
│   ├── middleware/
│   │   ├── error.middleware.js        # Error handling
│   │   └── validation.middleware.js   # Input validation
│   ├── models/
│   │   └── url.model.js               # Database queries
│   ├── routes/
│   │   └── url.routes.js             # API routes
│   ├── services/
│   │   └── url.service.js            # Business logic + caching
│   ├── utils/
│   │   └── helpers.js                 # Utility functions
│   └── index.js                  # Entry point
├── frontend/                # React frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx                   # Main App component
│   │   ├── index.css                 # Global styles + design tokens
│   │   ├── main.jsx                  # Entry point
│   │   ├── components/
│   │   │   ├── Footer.jsx              # Footer component
│   │   │   ├── Stats.jsx               # Statistics page
│   │   │   └── UrlShortener.jsx       # URL shortener form
│   │   └── services/
│   │       └── api.js                   # API client
│   └── public/
├── design/                  # Design system docs
│   └── DESIGN.md
├── docs/                    # Documentation
│   ├── api.md
│   └── architecture.md
└── prompts/                # AI prompts
    ├── algorithm.md
    ├── backend.md
    ├── database.md
    ├── debug.md
    ├── frontend.md
    ├── redis.md
    └── system.md
```

## Cài đặt

### Yêu cầu hệ thống
- Node.js 22+ và npm
- PostgreSQL 18+
- Redis (tùy chọn - fallback không cache)

### Bước 1: Clone và cài đặt dependencies

```bash
cd url-shortener
npm install
cd frontend && npm install && cd ..
```

### Bước 2: Cấu hình môi trường

Copy file mẫu và cập nhật thông tin:

```bash
cp .env.example .env
```

Sửa file `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=url_shortener
DB_USER=postgres
DB_PASSWORD=mật_khẩu_của_bạn

# Redis (tùy chọn)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# App
BASE_URL=http://localhost:3000
SHORT_CODE_LENGTH=6
```

### Bước 3: Tạo database và bảng

```bash
# Tạo database
"/c/Program Files/PostgreSQL/18/bin/psql.exe" -U postgres -c "CREATE DATABASE url_shortener;"

# Chạy schema
"/c/Program Files/PostgreSQL/18/bin/psql.exe" -U postgres -h localhost -d url_shortener -f database/schema.sql

# Chạy migration (thêm cột analytics)
"/c/Program Files/PostgreSQL/18/bin/psql.exe" -U postgres -h localhost -d url_shortener -f database/migration_add_analytics_columns.sql
```

### Bước 4: (Tùy chọn) Khởi động Redis

```bash
# Docker
docker run -p 6379:6379 redis

# Hoặc cài đặt Redis trực tiếp trên Windows (WSL)
```

## Chạy dự án

### Khởi động Backend

```bash
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3000`

### Khởi động Frontend (terminal khác)

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## API Endpoints

### 1. Tạo short URL

```http
POST http://localhost:3000/api/shorten
Content-Type: application/json

{
  "url": "https://www.example.com/some/long/url"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shortCode": "abc123",
    "shortUrl": "http://localhost:3000/abc123",
    "originalUrl": "https://www.example.com/some/long/url",
    "expiresAt": null
  }
}
```

### 2. Redirect to original URL

```http
GET http://localhost:3000/:shortCode
```

Tự động redirect 301 về URL gốc. Mỗi lần truy cập sẽ:
- Tăng số clicks trong bảng `urls`
- Lưu analytics vào bảng `url_analytics` (IP, User-Agent, Referrer, Country, City, Device type, Browser, OS)

### 3. Xem thống kê URL

```http
GET http://localhost:3000/api/stats/:shortCode
```

**Response:**
```json
{
  "success": true,
  "data": {
    "short_code": "abc123",
    "original_url": "https://www.example.com/some/long/url",
    "clicks": 42,
    "created_at": "2026-05-03T10:36:32.286Z",
    "expires_at": null,
    "last_clicked_at": "2026-05-03T10:36:52.053Z",
    "summary": {
      "total_clicks": "42",
      "unique_visitors": "15"
    },
    "topCountries": [
      {"country": "Vietnam", "count": "20"},
      {"country": "United States", "count": "15"}
    ],
    "topBrowsers": [
      {"browser": "Chrome", "count": "30"},
      {"browser": "Firefox", "count": "12"}
    ],
    "topDevices": [
      {"device_type": "desktop", "count": "25"},
      {"device_type": "mobile", "count": "17"}
    ],
    "dailyClicks": [
      {"date": "2026-05-03T17:00:00.000Z", "count": "42"}
    ]
  }
}
```

## Tính năng

### Core Features
- ✅ Rút gọn URL với nanoid (6 ký tự mặc định)
- ✅ Redirect nhanh với Redis cache (fallback về DB)
- ✅ Thống kê chi tiết (clicks, unique visitors)
- ✅ Analytics tracking (IP, location, device, browser, OS)
- ✅ Tự động xóa URLs hết hạn (cron job mỗi giờ)
- ✅ Rate limiting (100 requests/15 phút)
- ✅ Validation với Joi

### Security
- ✅ Helmet.js bảo vệ HTTP headers
- ✅ CORS enabled
- ✅ Rate limiting
- ✅ URL validation (phải là URL hợp lệ)

### Frontend Features
- ✅ Hero section với design system Notion-style
- ✅ Form nhập URL responsive
- ✅ Hiển thị short URL với nút Copy
- ✅ Trang thống kê với charts
- ✅ Top countries, browsers, devices
- ✅ Daily clicks chart (30 ngày gần nhất)
- ✅ Footer đầy đủ links
- ✅ Sticky navigation
- ✅ Responsive design (mobile → wide desktop)

## Cron Jobs

### Expired URL Cleanup
- **Tần suất:** Mỗi giờ
- **Chức năng:** Xóa URLs hết hạn và clear Redis cache tương ứng
- **File:** `src/jobs/cleanup.js`

## Development

### Build frontend
```bash
cd frontend
npm run build
```

### Check backend syntax
```bash
node --check src/index.js
```

## License

ISC

## Tác giả

Built with Claude Code - Senior Full-stack Engineer
