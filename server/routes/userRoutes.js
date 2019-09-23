const router = require('express').Router()
const UserController = require('../controllers/UserController')
const imagebb = require('../helpers/imgbb')

router.post('/register', imagebb, UserController.register)
router.post('/login', UserController.login)
router.patch('/update/:id', imagebb, UserController.update)
router.delete('/delete/:id', UserController.delete)

module.exports = router