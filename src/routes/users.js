const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { validateUser, validate } = require('../utils/validation');

router.post('/', validateUser, validate, usersController.createUser);
router.get('/', usersController.getUsers);
router.get('/stats', usersController.getUserStats);
router.get('/:id', usersController.getUserById);
router.put('/:id', validateUser, validate, usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;