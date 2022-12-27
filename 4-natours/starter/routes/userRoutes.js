const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, deleteUser, getUser, updateUser } = require('./../controllers/userController');

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
