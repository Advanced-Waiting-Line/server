const router = require('express').Router()
const queueLogController = require('../controllers/queueLogController')
const {authenticationCompany, authenticationUser} = require('../middlewares/authentication')

// router.get("/", queueLogController.findAll)
router.get('/user', authenticationUser, queueLogController.getQueueByUserId)
router.get('/',authenticationCompany, queueLogController.getAllCompanyQueueLog)
router.get('/todayLog', authenticationCompany, queueLogController.getTodayLog)
router.post('/oneDayLog', authenticationCompany, queueLogController.getOneDayLog)
router.post('/:companyId', authenticationUser, queueLogController.create)
router.use(authenticationCompany)
router.get('/weekly', queueLogController.getWeeklyPercentage)
router.put('/duration/:queueLogId',queueLogController.updateDuration)
router.put('/remove/:queueLogId', queueLogController.removeFromQueue)
router.put('/status/:queueLogId', queueLogController.updateStatus)



module.exports = router