const router = require('express').Router()
const CompanyController = require('../controllers/CompanyController')
const { multer, sendUploadToGCS } = require('../helpers/file')

router.post('/register', multer.single('file'), sendUploadToGCS, CompanyController.register)
router.post('/login', CompanyController.login)

module.exports = router