#!/bin/bash

yarn global add pnpm
pnpm add -D prisma
pnpm dlx prisma generate
pnpm dlx prisma db push
node server.js