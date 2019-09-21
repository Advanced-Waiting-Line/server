const router = require('express').Router()
const queueLogController = require('../controllers/queueLogController')
const {authenticationCompany} = require('../middlewares/authentication')
const {authorizationCompany} = require('../middlewares/authorization')

router.get("/", queueLogController.findAll)
router.use(authenticationCompany)
router.get('/:companyId', queueLogController.getAllCompanyQueueLog)
router.get('/todayLog/:companyId', queueLogController.getTodayLog)
router.post('/oneDayLog/:companyId', queueLogController.getOneDayLog)
router.post('/:companyId/:userId', authorizationCompany, queueLogController.create)
router.put('/:queueLogId',queueLogController.updateDuration)



module.exports = router