const { validationResult } = require('express-validator');
const Card = require('../models/card.model');
const cache = require('../cache/cards.cache');

async function list(req, res, next) {
  try {
    const userId = req.user.id;
    const status = req.query.status;

    const cached = await cache.getList(userId, status);
    if (cached) return res.json(cached);

    const cards = await Card.findAllByUser(userId, { status });
    await cache.setList(userId, status, cards);
    res.json(cards);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cached = await cache.getItem(id, userId);
    if (cached) return res.json(cached);

    const card = await Card.findByIdAndUser(id, userId);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    await cache.setItem(id, userId, card);
    res.json(card);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status } = req.body;
    const [card] = await Card.create({
      title,
      description: description || null,
      status: status || 'todo',
      user_id: req.user.id,
    });

    await cache.invalidateUser(req.user.id);
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;

    const [card] = await Card.update(req.params.id, req.user.id, data);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    await cache.invalidateUser(req.user.id);
    res.json(card);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const count = await Card.remove(req.params.id, req.user.id);
    if (count === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    await cache.invalidateUser(req.user.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };
