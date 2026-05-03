# URL Shortener Architecture

## Stack

* Frontend: React
* Backend: Node.js (Express)
* Database: PostgreSQL
* Cache: Redis

## Core Features

* Create short URL
* Redirect to original URL
* Track click analytics

## Flow

### Create URL

Client → API → DB → Encode → Return short link

### Redirect

Client → Redis → DB (if miss) → Redirect

## Performance

* Redis caching
* DB indexing on short_code

## Future Improvements

* Rate limiting
* Expired links
* Custom short URLs
