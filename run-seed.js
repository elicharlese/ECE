#!/usr/bin/env node

// Set environment variables for Supabase connection
process.env.DATABASE_URL = "postgresql://postgres:wjY4PmCICs5Tt1yx@db.fmlcblwrgqiztlnmowmw.supabase.co:6543/postgres?sslmode=require";
process.env.DIRECT_URL = "postgresql://postgres:wjY4PmCICs5Tt1yx@db.fmlcblwrgqiztlnmowmw.supabase.co:5432/postgres?sslmode=no-verify";

// Import and run the compiled seed script
require('./dist/seed-batch4.js');
