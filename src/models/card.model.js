const db = require('../config/database');

function findAllByUser(userId, filters = {}) {
  const query = db('cards').where({ user_id: userId }).orderBy('created_at', 'desc');
  if (filters.status) {
    query.andWhere({ status: filters.status });
  }
  return query;
}

function findByIdAndUser(id, userId) {
  return db('cards').where({ id, user_id: userId }).first();
}

function create(data) {
  return db('cards').insert(data).returning('*');
}

function update(id, userId, data) {
  return db('cards')
    .where({ id, user_id: userId })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
}

function remove(id, userId) {
  return db('cards').where({ id, user_id: userId }).del();
}

module.exports = { findAllByUser, findByIdAndUser, create, update, remove };
