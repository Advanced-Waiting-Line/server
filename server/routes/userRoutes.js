const router = require('express').Router()
const UserController = require('../controllers/UserController')
const file = require('../helpers/file')

router.post('/register', file.multer.single('file'), file.sendUploadToGCS, UserController.register)
router.post('/login', UserController.login)

module.exports = router