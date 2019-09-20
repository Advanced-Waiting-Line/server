const router = require('express').Router()
const problemController = require('../controllers/problemController')
const {authenticationCompany} = require('../middlewares/authentication')

router.get('/', problemController.findAll)
router.get('/:companyId', problemController.getCompanyProblem)
router.use(authenticationCompany)
router.post('/', problemController.create)


module.exports = router