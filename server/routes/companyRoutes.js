const router = require('express').Router()
const CompanyController = require('../controllers/CompanyController')
const file = require('../helpers/file')

router.post('/register', file.multer.single('file'), file.sendUploadToGCS, CompanyController.register)
router.post('/login', CompanyController.login)

module.exports = router