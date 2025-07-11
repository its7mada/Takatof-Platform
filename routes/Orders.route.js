const express = require('express')
const orders = require('../controllers/orders.controller')
const router = express.Router()

router.post('/', orders.checkout);
router.patch('/cancel/:id', orders.cancelOrderd);
router.patch('/sold/:id', orders.soldOrder);
router.get('/', orders.getOrder);
router.get('/filter', orders.filterOrders);
router.patch('/accept/:id', orders.acceptOrder);
router.patch('/reject/:id', orders.rejectOrder);
router.delete('/delete/:id', orders.deleteOrder);
router.get('/getsellerorders/:id', orders.getOrderForSeller);

module.exports = router;