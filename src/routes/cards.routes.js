const { Router } = require('express');
const { body } = require('express-validator');
const authenticate = require('../middleware/auth');
const { list, getById, create, update, remove } = require('../controllers/cards.controller');

const router = Router();

router.use(authenticate);

const createValidation = [
  body('title').trim().notEmpty(),
  body('description').optional().isString(),
  body('status').optional().isIn(['todo', 'in_progress', 'done']),
];

const updateValidation = [
  body('title').optional().trim().notEmpty(),
  body('description').optional().isString(),
  body('status').optional().isIn(['todo', 'in_progress', 'done']),
];

router.get('/', list);
router.get('/:id', getById);
router.post('/', createValidation, create);
router.put('/:id', updateValidation, update);
router.delete('/:id', remove);

module.exports = router;
