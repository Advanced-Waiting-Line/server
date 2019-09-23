const router = require('express').Router()
const queueLogController = require('../controllers/queueLogController')
const {authenticationCompany, authenticationUser} = require('../middlewares/authentication')

// router.get("/", queueLogController.findAll)
router.use(authenticationCompany)
router.get('/', queueLogController.getAllCompanyQueueLog)
router.get('/todayLog', queueLogController.getTodayLog)
router.post('/oneDayLog', queueLogController.getOneDayLog)
router.post('/:companyId', authenticationUser, queueLogController.create)
router.put('/duration/:queueLogId',queueLogController.updateDuration)
router.put('/remove/:queueLogId', queueLogController.removeFromQueue)
router.put('/status/:queueLogId', queueLogController.updateStatus)



module.exports = router