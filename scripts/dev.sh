#!/bin/bash
source "$(dirname "$0")/compose.sh"

compose "docker-compose.dev.yml" "$1" "$2"
