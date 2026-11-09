import React, { useState } from 'react';
import {
  FileCode,
  Database,
  Server,
  Terminal,
  Copy,
  Check,
  Download,
  ShieldCheck,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface DeploymentInspectorProps {
  onBackToStore: () => void;
}

export const DeploymentInspector: React.FC<DeploymentInspectorProps> = ({ onBackToStore }) => {
  const [activeFile, setActiveFile] = useState<string>('schema.sql');
  const [copied, setCopied] = useState(false);

  const fileSnippets: Record<string, { title: string; category: string; content: string }> = {
    'schema.sql': {
      title: 'database/schema.sql',
      category: 'Database (MySQL)',
      content: `-- ============================================================
-- THANIMA (തനിമ) - Kerala Homely Foods E-Commerce Schema
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS thanima CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE thanima;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'manager', 'super_admin') DEFAULT 'customer',
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  malayalam_name VARCHAR(255) NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  description TEXT,
  image VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  malayalam_name VARCHAR(255) NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  short_description TEXT,
  description LONGTEXT,
  ingredients TEXT,
  shelf_life VARCHAR(100),
  storage_instructions VARCHAR(255),
  is_veg TINYINT(1) DEFAULT 1,
  is_featured TINYINT(1) DEFAULT 0,
  is_bestseller TINYINT(1) DEFAULT 0,
  is_new TINYINT(1) DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_prod_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Product Categories Pivot (Many-to-Many)
CREATE TABLE IF NOT EXISTS product_categories (
  product_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  weight VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  mrp DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(100) NOT NULL UNIQUE,
  user_id INT NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(191) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0.00,
  delivery_charge DECIMAL(10,2) DEFAULT 0.00,
  cod_fee DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL,
  payment_method ENUM('upi', 'gpay', 'phonepe', 'card', 'cod') NOT NULL,
  payment_status ENUM('Pending', 'Paid', 'Failed', 'Refunded', 'COD-Pending') DEFAULT 'Pending',
  order_status ENUM('Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned') DEFAULT 'Pending',
  courier_name VARCHAR(100),
  tracking_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_num (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    },
    'Dockerfile': {
      title: 'Dockerfile',
      category: 'Container / OpenShift',
      content: `# Thanima (തനിമ) - Production Dockerfile for Red Hat OpenShift & Docker
FROM php:8.2-apache

# Install system dependencies & PHP extensions
RUN apt-get update && apt-get install -y \\
    libpng-dev \\
    libonig-dev \\
    libxml2-dev \\
    libicu-dev \\
    zip \\
    unzip \\
    && docker-php-ext-install pdo_mysql mbstring gd intl opcache

# Enable Apache mod_rewrite for clean MVC URLs
RUN a2enmod rewrite

# Configure Apache DocumentRoot to /var/www/html/public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!$\{APACHE_DOCUMENT_ROOT\}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!$\{APACHE_DOCUMENT_ROOT\}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Listen on port 8080 (Mandatory for OpenShift Non-Root restricted SCC)
RUN sed -i -e 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf
RUN sed -i -e 's/:80/:8080/' /etc/apache2/sites-available/000-default.conf

# Copy Application Code
WORKDIR /var/www/html
COPY . /var/www/html/

# Support arbitrary OpenShift non-root user (root group 0 permissions)
RUN chgrp -R 0 /var/www/html /var/log/apache2 /var/run/apache2 \\
    && chmod -R g=u /var/www/html /var/log/apache2 /var/run/apache2

EXPOSE 8080

USER 1001

CMD ["apache2-foreground"]`,
    },
    'docker-compose.yml': {
      title: 'docker-compose.yml',
      category: 'Local Dev Stack',
      content: `version: '3.8'

services:
  web:
    build: .
    container_name: thanima_web
    ports:
      - "8080:8080"
    environment:
      - APP_ENV=local
      - APP_URL=http://localhost:8080
      - DB_HOST=db
      - DB_NAME=thanima
      - DB_USER=thanima_user
      - DB_PASS=thanima_secret
    depends_on:
      - db
    volumes:
      - .:/var/www/html
    restart: unless-stopped

  db:
    image: mysql:8.0
    container_name: thanima_mysql
    environment:
      MYSQL_DATABASE: thanima
      MYSQL_USER: thanima_user
      MYSQL_PASSWORD: thanima_secret
      MYSQL_ROOT_PASSWORD: root_secret_password
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01_schema.sql
      - ./database/seed.sql:/docker-entrypoint-initdb.d/02_seed.sql
    restart: unless-stopped

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: thanima_phpmyadmin
    environment:
      PMA_HOST: db
      PMA_USER: root
      PMA_PASSWORD: root_secret_password
    ports:
      - "8081:80"
    depends_on:
      - db

volumes:
  db_data:`,
    },
    'openshift-app.yaml': {
      title: 'openshift/app-deployment.yaml',
      category: 'OpenShift Manifests',
      content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: thanima-app
  namespace: thanima
  labels:
    app: thanima-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: thanima-app
  template:
    metadata:
      labels:
        app: thanima-app
    spec:
      containers:
      - name: thanima-php
        image: image-registry.openshift-image-registry.svc:5000/thanima/thanima-app:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
          protocol: TCP
        envFrom:
        - configMapRef:
            name: thanima-config
        - secretRef:
            name: thanima-secrets
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
        readinessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 20
        volumeMounts:
        - name: uploads-volume
          mountPath: /var/www/html/public/assets/uploads
      volumes:
      - name: uploads-volume
        persistentVolumeClaim:
          claimName: thanima-uploads-pvc`,
    },
    'DEPLOYMENT.md': {
      title: 'DEPLOYMENT.md',
      category: 'OpenShift CLI Playbook',
      content: `# Red Hat OpenShift Deployment Guide: Thanima (തനിമ)

## 1. Login and Project Creation
\`\`\`bash
oc login https://api.openshift.example.com:6443 --token=YOUR_TOKEN
oc new-project thanima --display-name="Thanima Homely Foods"
\`\`\`

## 2. Apply Secrets and ConfigMap
\`\`\`bash
oc apply -f openshift/secret.yaml
oc apply -f openshift/configmap.yaml
\`\`\`

## 3. Deploy MySQL Database & Storage
\`\`\`bash
oc apply -f openshift/mysql-pvc.yaml
oc apply -f openshift/mysql-deployment.yaml
oc apply -f openshift/mysql-service.yaml
\`\`\`

## 4. Run Initial Schema & Seed Job
\`\`\`bash
oc apply -f openshift/job-db-init.yaml
oc wait --for=condition=complete job/thanima-db-init -n thanima --timeout=120s
\`\`\`

## 5. Build and Deploy Application Image
\`\`\`bash
oc apply -f openshift/uploads-pvc.yaml
oc apply -f openshift/imagestream.yaml
oc apply -f openshift/buildconfig.yaml

# Start binary build from local repo
oc start-build thanima-app --from-dir=. --follow
\`\`\`

## 6. Expose App & TLS Route
\`\`\`bash
oc apply -f openshift/app-deployment.yaml
oc apply -f openshift/app-service.yaml
oc apply -f openshift/route.yaml
\`\`\`

## 7. Verify Deployment
\`\`\`bash
oc get pods -n thanima
oc get routes -n thanima
\`\`\``,
    },
  };

  const currentSnippet = fileSnippets[activeFile] || fileSnippets['schema.sql'];

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentSnippet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F4D2B] bg-[#FFF8E7] px-2.5 py-0.5 rounded-full border border-[#F2A900]/40">
              DevOps & Engineering Stack
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#4A2C17] mt-1 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-[#1F4D2B]" />
            <span>Architecture & Deployment Inspector</span>
          </h1>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            Inspect the complete PHP 8.2 MVC backend, MySQL schemas, Dockerfile, and Red Hat OpenShift manifests.
          </p>
        </div>

        <button
          onClick={onBackToStore}
          className="px-4 py-2 bg-[#1F4D2B] text-white text-xs font-semibold rounded-xl hover:bg-[#14381F] flex items-center gap-1.5 self-start cursor-pointer"
        >
          <span>Return to Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* File Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(fileSnippets).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setActiveFile(key)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all ${
              activeFile === key
                ? 'bg-[#1F4D2B] text-white shadow-xs'
                : 'bg-white border border-[#EFE8D8] text-slate-700 hover:bg-[#FFF8E7]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-[#F2A900]" />
            <span>{data.title}</span>
          </button>
        ))}
      </div>

      {/* Code Viewer Card */}
      <div className="bg-[#1E1E24] text-slate-100 rounded-3xl overflow-hidden shadow-xl border border-slate-700">
        <div className="bg-[#141418] px-6 py-3 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#F2A900] font-bold">{currentSnippet.title}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{currentSnippet.category}</span>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-lg flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Content'}</span>
          </button>
        </div>

        <pre className="p-6 text-xs font-mono overflow-x-auto leading-relaxed text-emerald-300 max-h-[500px]">
          {currentSnippet.content}
        </pre>
      </div>
    </div>
  );
};
