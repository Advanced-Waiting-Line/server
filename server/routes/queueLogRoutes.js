const router = require('express').Router()
const queueLogController = require('../controllers/queueLogController')
const {authenticationCompany} = require('../middlewares/authentication')
const {authorizationCompany} = require('../middlewares/authorization')

// router.get("/", queueLogController.findAll)
router.use(authenticationCompany)
router.get('/', queueLogController.getAllCompanyQueueLog)
router.get('/todayLog', queueLogController.getTodayLog)
router.post('/oneDayLog', queueLogController.getOneDayLog)
router.post('/:companyId/:userId', queueLogController.create)
router.put('/duration/:queueLogId',queueLogController.updateDuration)
router.put('/remove/:queueLogId', queueLogController.removeFromQueue)
router.put('/status/:queueLogId', queueLogController.updateStatus)



module.exports = router