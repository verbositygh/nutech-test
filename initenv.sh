#!/bin/bash

ENV_FILES=(".env" ".env.local")
ENV_EXAMPLE_FILES=(".env.example" ".env.local.example")
RAND_KEY="$(tr -dc 'A-F0-9' < /dev/random | head -c32)"

cd "$(dirname "$0")"
source ./modules/dotenv/dotenv

for file in "${ENV_FILES[@]}"; do
  if [[ -f "./${file}" ]]; then
    echo "File ${file} already exists."
    exit 1
  fi
done
for file in "${ENV_EXAMPLE_FILES[@]}"; do
  if [[ ! -f "./${file}" ]]; then
    echo "File ${file} does not exist."
    exit 1
  fi
done

cp "./.env.example" "./.env"
cp "./.env.local.example" "./.env.local"

.env --file ".env.local"
.env set JWT_KEY="$RAND_KEY"

