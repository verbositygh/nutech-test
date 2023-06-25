#!/bin/bash

ENV_FILES=(".env" ".env.local")
ENV_EXAMPLE_FILES=(".env.example" ".env.local.example")
RAND_KEY="$(tr -dc 'A-F0-9' < /dev/random | head -c32)"
FLAGS="$1"
SKIP_CHECKS="n"

cd "$(dirname "$0")"
source ./modules/dotenv/dotenv

if [[ "$FLAGS" = "--skip-existing-file-check" ]]; then
  SKIP_CHECKS="y"
fi

if [[ "$SKIP_CHECKS" = "n" ]]; then
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
fi

if [[ ! -f ".env" ]]; then
  cp "./.env.example" "./.env"
fi
if [[ ! -f ".env.local" ]]; then
  cp "./.env.local.example" "./.env.local"
fi

.env --file ".env.local"
.env set JWT_KEY="$RAND_KEY"

