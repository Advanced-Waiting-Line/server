const router = require('express').Router()
const CompanyController = require('../controllers/CompanyController')
const imagebb = require('../helpers/imgbb')

router.post('/register', imagebb, CompanyController.register)
router.post('/login', CompanyController.login)
router.get('/findAll', CompanyController.findAllCompany)
router.get('/findOne/:id', CompanyController.findCompanyById)
router.post('/clearQueue/:id', CompanyController.clearQueue)

module.exports = router