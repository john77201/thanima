# Thanima Database Import Guide

## Prerequisites
- MySQL 8.0+ or MariaDB 10.6+ with `utf8mb4` support.
- MySQL client command line tool or phpMyAdmin / DBeaver.

## Quick CLI Import
\`\`\`bash
# 1. Create database and import schema
mysql -u root -p < database/schema.sql

# 2. Seed initial data (categories, 80+ products, admin, coupons, FAQs)
mysql -u root -p thanima < database/seed.sql
\`\`\`

## Docker Import
When running with \`docker-compose up\`, the MySQL service automatically imports both \`database/schema.sql\` and \`database/seed.sql\` via \`/docker-entrypoint-initdb.d/\`.

## Default Admin Credentials
- **URL:** \`/admin\`
- **Email:** \`admin@thanima.in\`
- **Password:** \`Admin@123\`
