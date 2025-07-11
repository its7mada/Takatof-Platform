const express = require('express')
const { addToCart, deleteItem, gitCartByUserId, updateQuantity, gitUserCartCaount } = require('../controllers/cart.controller')
const router = express.Router()

router.post('/', addToCart)
router.get('/:userId', gitCartByUserId)
router.delete('/', deleteItem)
router.patch('/editQuantity', updateQuantity)
router.get('/gitCount/:userId', gitUserCartCaount)
module.exports = router