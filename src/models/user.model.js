const db = require('../config/database');

function findByEmail(email) {
  return db('users').where({ email }).first();
}

function create({ email, passwordHash }) {
  return db('users')
    .insert({ email, password_hash: passwordHash })
    .returning(['id', 'email', 'created_at']);
}

module.exports = { findByEmail, create };
