const router = require('express').Router()
const UserController = require('../controllers/UserController')
const { multer, sendUploadToGCS } = require('../helpers/file')

router.post('/register', multer.single('file'), sendUploadToGCS, UserController.register)
router.post('/login', UserController.login)
router.patch('/update/:id', multer.single('file'), sendUploadToGCS, UserController.update)
router.delete('/delete/:id', UserController.delete)

module.exports = router