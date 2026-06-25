const redis = require('../config/redis');

const TTL = 300;

function listKey(userId, status) {
  return status ? `cards:user:${userId}:status:${status}` : `cards:user:${userId}`;
}

function itemKey(id, userId) {
  return `cards:${id}:user:${userId}`;
}

async function getList(userId, status) {
  const raw = await redis.get(listKey(userId, status));
  return raw ? JSON.parse(raw) : null;
}

async function setList(userId, status, data) {
  await redis.set(listKey(userId, status), JSON.stringify(data), 'EX', TTL);
}

async function getItem(id, userId) {
  const raw = await redis.get(itemKey(id, userId));
  return raw ? JSON.parse(raw) : null;
}

async function setItem(id, userId, data) {
  await redis.set(itemKey(id, userId), JSON.stringify(data), 'EX', TTL);
}

async function invalidateUser(userId) {
  const pattern = `cards:*user:${userId}*`;
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

module.exports = { getList, setList, getItem, setItem, invalidateUser };
