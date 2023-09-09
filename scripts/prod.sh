#!/bin/bash
source "$(dirname "$0")/compose.sh"

compose "docker-compose.prod.yml" "$1" "$2"

