#!/bin/bash

compose() {
    local compose_file="$1"
    local command="$2"
    local flags="$3"

    if [ "$command" == "start" ]; then
        docker-compose -f docker-compose.yml -f "$compose_file" up -d $flags
    elif [ "$command" == "stop" ]; then
        docker-compose -f docker-compose.yml -f "$compose_file" down $flags
    else
        echo "Expected argument [start|stop]"
        exit 1
    fi
}
