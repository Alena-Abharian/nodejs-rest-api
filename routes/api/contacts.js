const express = require('express');
const {isValidId, authenticate} = require("../../middlewares")

const ctrl = require("../../controllers/contacts")

const router = express.Router();

router.get('/', authenticate, ctrl.getAll);

router.get('/:contactId', authenticate, isValidId, ctrl.getById);

router.post('/', authenticate, ctrl.add);

router.delete('/:contactId', authenticate, isValidId, ctrl.remove);

router.put('/:contactId', authenticate, isValidId, ctrl.update);

router.patch("/:contactId/favorite", authenticate, isValidId, ctrl.updateFavoriteContact);

module.exports = router
