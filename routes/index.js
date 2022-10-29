const router = require('express').Router()
const formidableMiddleware = require('express-formidable')

const authController = require('../controller/authController')

router.get('/', authController.loginPage)
router.post('/login', authController.login)
router.get('/dashboard', authController.dashboard)
router.post('/add-photo', formidableMiddleware(), authController.addPhoto)

module.exports = router