const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://postgres:wjY4PmCICs5Tt1yx@db.fmlcblwrgqiztlnmowmw.supabase.co:5432/postgres?sslmode=no-verify'
});

client.connect()
  .then(() => {
    console.log('Connected successfully');
    client.end();
  })
  .catch((err) => {
    console.error('Connection error:', err.message);
  });
