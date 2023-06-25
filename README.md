# About
Project for Nutech technical test. It uses the default Next.js 13 configurations. 
The stack additionally uses Prisma for ORM, SQLite for database, TanStack Query for fetch helper, Zod for validator, Jose for JWT helper, Jotai for state management and more.

# Instructions
- Clone this repo with every submodules
- Run `pnpm install` to install dependencies. If using `pnpm` or replace it with `npm` or `yarn` or any other's equivalent for the rest of the instructions
- Run `pnpm init:env` to generate `.env` and `.env.local` files
- Run `npx prisma migrate dev` to apply database migrations and seeders
- Run `pnpm dev` to run the development server
