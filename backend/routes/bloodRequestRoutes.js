const express = require('express');
const router = express.Router();
const controller = require('../controllers/bloodRequestController');

// CRUD routes
router.get('/', controller.listAll);
router.post('/', controller.create);
router.get('/:id', controller.getById);
router.put('/:id', controller.updateById);
router.delete('/:id', controller.deleteById);

// ✅ Approve/Decline endpoint
router.patch('/:id', controller.updateStatus);

// ✅ Count pending blood requests
router.get('/count/pending', controller.countPending);

module.exports = router;
