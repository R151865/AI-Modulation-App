#!/bin/bash

# Script to send a demo message to the moderation API
API_URL="http://localhost:3001/api/ingest/text"

# Sample messages - some harmless, some potentially problematic
MESSAGES=(
  "Hello, how are you doing today?"
  "The weather is really nice outside."
  "I hate this product, it's terrible and everyone involved is stupid."
  "This is a wonderful application that helps keep communities safe."
  "Let's attack them and show them what happens when they mess with us."
)

for message in "${MESSAGES[@]}"; do
  echo "Sending: $message"
  curl -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{\"text\": \"$message\", \"timestamp\": \"$(date -Iseconds)\", \"id\": \"$(uuidgen)\"}"
  echo -e "\n---"
  sleep 1
done