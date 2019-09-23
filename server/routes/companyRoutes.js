const router = require('express').Router()
const CompanyController = require('../controllers/CompanyController')
const { multer, sendUploadToGCS } = require('../helpers/file')
const imagebb = require('../helpers/imgbb')

router.post('/register', imagebb, CompanyController.register)
router.post('/login', CompanyController.login)
router.post('/clearQueue/:id', CompanyController.clearQueue)

module.exports = router