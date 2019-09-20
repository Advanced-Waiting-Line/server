const router = require('express').Router()
const companyRoutes = require('./companyRoutes')
const userRoutes = require('./userRoutes')
const queueLogRoutes = require ('./queueLogRoutes')

router.use('/companies', companyRoutes)
router.use('/users', userRoutes)
router.use('/queueLogs', queueLogRoutes)

module.exports = router