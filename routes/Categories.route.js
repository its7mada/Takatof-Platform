const express = require('express')
const { addCategory, gitCategories } = require('../controllers/categories.controller')
const router = express.Router()

router.post('/', addCategory)
router.get('/', gitCategories)
module.exports = router