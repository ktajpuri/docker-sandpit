require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './migrations',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // RDS enforces TLS (rds.force_ssl=1). Encrypt the connection; skip CA
      // verification since we don't bundle the RDS CA into the image.
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: './migrations',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
