const router = require('express').Router()
const companyRoutes = require('./companyRoutes')
const userRoutes = require('./userRoutes')
const queueLogRoutes = require ('./queueLogRoutes')
const problemRoutes = require('./problemRoutes')

router.use('/companies', companyRoutes)
router.use('/users', userRoutes)
router.use('/queueLogs', queueLogRoutes)
router.use('/problems', problemRoutes)

module.exports = router