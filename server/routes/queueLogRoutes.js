const router = require('express').Router()
const queueLogController = require('../controllers/queueLogController')

router.get("/", queueLogController.findAll)
router.get('/oneDayLog/:companyId', queueLogController.getOneDayLog)
//needs authorization
router.post('/:companyId', queueLogController.create)



module.exports = router