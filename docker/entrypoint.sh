#!/bin/bash
set -e

# Ensure writable permissions on runtime storage for OpenShift
mkdir -p /var/www/html/public/assets/uploads /var/www/html/storage/logs

# Execute container CMD
exec "$@"
