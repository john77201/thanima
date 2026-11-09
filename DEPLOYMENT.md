# OpenShift Enterprise Deployment Guide - Thanima Platform

This guide provides end-to-end instructions for provisioning, configuring, and maintaining the **Thanima (തനിമ)** e-commerce application on Red Hat OpenShift Container Platform (OCP 4.12+).

---

## 📋 Table of Contents
1. [Prerequisites & Architecture](#1-prerequisites--architecture)
2. [Project & Security Context](#2-project--security-context)
3. [Configuration & Secrets Provisioning](#3-configuration--secrets-provisioning)
4. [Persistent Storage Setup (PVC)](#4-persistent-storage-setup-pvc)
5. [Database Deployment & Automated Initialization](#5-database-deployment--automated-initialization)
6. [Container Build & ImageStream (S2I)](#6-container-build--imagestream-s2i)
7. [Application Deployment & Service](#7-application-deployment--service)
8. [Edge TLS Route Configuration](#8-edge-tls-route-configuration)
9. [Verification & Health Probes](#9-verification--health-probes)
10. [Scaling, Auto-scaling & High Availability](#10-scaling-auto-scaling--high-availability)
11. [Troubleshooting & Rollbacks](#11-troubleshooting--rollbacks)

---

## 1. Prerequisites & Architecture

### Requirements
- OpenShift CLI (`oc`) v4.12 or higher installed locally.
- Active OpenShift cluster with `cluster-admin` or project-admin privileges.
- Ingress router enabled with default domain wildcard (e.g. `*.apps.cluster-domain.com`).
- Standard StorageClass supporting `ReadWriteOnce` (for MySQL) and `ReadWriteMany` (for uploads).

### Network Architecture
```
[Client / Browser]
       │
       ▼ (HTTPS port 443)
[OpenShift Router / Ingress]  <-- Edge TLS Termination (Route)
       │
       ▼ (HTTP port 8080)
[Service: thanima-app]
       │
       ▼ (port 8080, non-root USER 1001)
[Pod: thanima-app-xxxxx]
       │
       ├──> Mounts PVC /var/www/html/public/uploads (RWX)
       └──> Connects to [Service: thanima-mysql:3306]
                                 │
                                 ▼
                     [Pod: thanima-mysql-xxxxx]
                                 │
                                 └──> Mounts PVC /var/lib/mysql/data (RWO 10Gi)
```

---

## 2. Project & Security Context

Log in to your OpenShift cluster and create a dedicated namespace:

```bash
# 1. Authenticate with OpenShift
oc login --token=<YOUR_OPENSHIFT_API_TOKEN> --server=https://api.ocp.yourcluster.com:6443

# 2. Create the Thanima production namespace
oc new-project thanima-prod --display-name="Thanima Homely Foods Production" --description="Production environment for Thanima Kerala e-commerce platform"

# 3. Switch context to the project
oc project thanima-prod
```

### Security Note on Non-Root Containers
The provided `Dockerfile` is built to strictly adhere to OpenShift's arbitrary UID policy:
- Runs as `USER 1001` belonging to root group `0` (`chown -R 1001:0` and `chmod -R g+rwX`).
- Binds to unprivileged port `8080` (never privileged port 80).
- Compatible with OpenShift's default `restricted-v2` Security Context Constraint (SCC). No privileged SCC required.

---

## 3. Configuration & Secrets Provisioning

Deploy the configuration map and database/gateway credentials:

```bash
# 1. Review or customize environment values in openshift/configmap.yaml
oc apply -f openshift/configmap.yaml

# 2. Deploy secret containing sensitive credentials (DB passwords, Razorpay keys)
# Tip: Replace the base64-encoded placeholders in openshift/secret.yaml before production deployment
oc apply -f openshift/secret.yaml

# 3. Verify configurations were created
oc get configmap thanima-config
oc get secret thanima-secrets
```

---

## 4. Persistent Storage Setup (PVC)

Provision storage for MySQL databases and customer product uploads:

```bash
# 1. Create 10Gi volume for MySQL data directory
oc apply -f openshift/mysql-pvc.yaml

# 2. Create 5Gi shared volume for user media & invoice uploads
oc apply -f openshift/uploads-pvc.yaml

# 3. Verify PVC status shows 'Bound'
oc get pvc
```

---

## 5. Database Deployment & Automated Initialization

Deploy the MySQL 8.0 instance and trigger the automated schema & seed migration job:

```bash
# 1. Deploy MySQL Deployment and ClusterIP Service
oc apply -f openshift/mysql-deployment.yaml
oc apply -f openshift/mysql-service.yaml

# 2. Wait for MySQL Pod to reach 'Running' and 'Ready' status
oc rollout status deployment/thanima-mysql

# 3. Execute the automated DB migration Job (creates 12 tables and seeds 80+ products)
oc apply -f openshift/job-db-init.yaml

# 4. Monitor the Job completion
oc wait --for=condition=complete --timeout=120s job/thanima-db-init
oc logs job/thanima-db-init
```

---

## 6. Container Build & ImageStream (S2I)

Create the ImageStream and BuildConfig to build the application container directly inside the OpenShift cluster:

```bash
# 1. Create ImageStream
oc apply -f openshift/imagestream.yaml

# 2. Create BuildConfig
oc apply -f openshift/buildconfig.yaml

# 3. Trigger a binary or Git build:
# Option A: Direct local directory upload build
oc start-build thanima-app --from-dir=. --follow

# Option B: If BuildConfig is configured with Git repository webhook
oc start-build thanima-app --follow

# 4. Confirm the built image is tagged in the ImageStream
oc get is thanima-app
```

---

## 7. Application Deployment & Service

Deploy the core application pods and internal service:

```bash
# 1. Apply application deployment and service manifests
oc apply -f openshift/app-deployment.yaml
oc apply -f openshift/app-service.yaml

# 2. Monitor rollout status
oc rollout status deployment/thanima-app

# 3. Verify running pods
oc get pods -l app=thanima,component=web
```

---

## 8. Edge TLS Route Configuration

Expose the application externally via OpenShift's Ingress Router with automated HTTPS redirect:

```bash
# 1. Apply the Route manifest
oc apply -f openshift/route.yaml

# 2. Retrieve the assigned public URL
THANIMA_HOST=$(oc get route thanima-route -o jsonpath='{.spec.host}')
echo "Thanima platform is live at: https://${THANIMA_HOST}"
```

---

## 9. Verification & Health Probes

Verify system health, logs, and database connectivity:

```bash
# 1. Test the HTTP liveness probe endpoint
curl -kI https://${THANIMA_HOST}/healthz

# 2. Stream application logs
oc logs -f deployment/thanima-app -c web

# 3. Test MySQL query from inside application container
oc exec -it deployment/thanima-app -c web -- php -r "
  \$pdo = new PDO('mysql:host=thanima-mysql;dbname=thanima_db;charset=utf8mb4', 'thanima_user', 'ThanimaSecure#2025');
  \$stmt = \$pdo->query('SELECT COUNT(*) FROM products');
  echo 'Total active products: ' . \$stmt->fetchColumn() . PHP_EOL;
"
```

---

## 10. Scaling, Auto-scaling & High Availability

### Manual Scaling
To handle seasonal festival spikes (e.g., Onam, Vishu):
```bash
# Scale to 5 replicas
oc scale deployment/thanima-app --replicas=5
```

### Horizontal Pod Autoscaler (HPA)
Deploy automatic elasticity based on CPU and Memory utilization:
```bash
oc autoscale deployment/thanima-app --min=2 --max=10 --cpu-percent=75
oc get hpa
```

---

## 11. Troubleshooting & Rollbacks

### Common Diagnostic Commands
```bash
# Describe deployment for event errors
oc describe deployment thanima-app

# Check pod exit codes and termination reasons
oc describe pod <pod-name>

# Inspect Apache error log inside a container
oc exec <pod-name> -c web -- cat /var/log/apache2/error.log
```

### Instant Rollback
In the event of an unexpected release regression:
```bash
# View rollout revision history
oc rollout history deployment/thanima-app

# Roll back to the previous stable release
oc rollout undo deployment/thanima-app
```
