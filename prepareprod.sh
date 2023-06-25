#!/bin/bash

pnpm init:envskipcheck
pnpm install 
# rm -rf prisma/migrations 
# mkdir -p prisma/migrations/0_init 
# npx prisma migrate diff --from-empty  --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql 
npx prisma migrate deploy
