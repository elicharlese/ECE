#!/bin/bash

# Set environment variables for Supabase connection
export DATABASE_URL="postgresql://postgres:wjY4PmCICs5Tt1yx@db.fmlcblwrgqiztlnmowmw.supabase.co:6543/postgres?sslmode=require"
export DIRECT_URL="postgresql://postgres:wjY4PmCICs5Tt1yx@db.fmlcblwrgqiztlnmowmw.supabase.co:5432/postgres?sslmode=no-verify"

# Run the seed script
npx ts-node scripts/seed-batch4.ts
