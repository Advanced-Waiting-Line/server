const router = require('express').Router()
const CompanyController = require('../controllers/CompanyController')

router.post('/register', CompanyController.register)
router.post('/login', CompanyController.login)

module.exports = router