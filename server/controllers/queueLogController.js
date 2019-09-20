const QueueLog = require('../model/QueueLog')
const Problem = require('../model/Problem')
const delayCheckIn = require('../helpers/checkInModifyer/delayCheckIn')

class QueueLogController {
  static findAll(req,res,next){
    QueueLog.find({})
    .populate('problem')
    .populate('companyId')
    .populate('userId')
    .then(queues=>{
        res.json(queues)
    })
  }

  static getAllCompanyQueueLog(req,res,next){
    QueueLog.find({
      "companyId": req.params.companyId})
    .then(queues=>{
      res.json(queues)
    }).catch(err=>{
      next(err)
    })
  }

  static getTodayLog(req,res,next){
    let logDate = new Date()
    const start = logDate.setHours(7)
    const end = logDate.setHours(23)
    QueueLog.find({
      "companyId": req.params.companyId,
      "checkIn": {"$gte": start, "$lt": end}})
    .then(queues=>{
      res.json(queues)
    }).catch(err=>{
      next(err)
    })
  }

  static getOneDayLog(req,res,next){
    let logDate = new Date()
    logDate.setDate(req.body.date)
    logDate.setMonth(req.body.month)
    logDate.setFullYear(req.body.year)

    const start = logDate.setHours(7)
    const end = logDate.setHours(23)
    QueueLog.find({
      "companyId": req.params.companyId,
      "checkIn": {"$gte": start, "$lt": end}})
    .then(queues=>{
      res.json(queues)
    }).catch(err=>{
      next(err)
    })
    
  }
  static addDuration(req,res,next){
    Queue.findOneAndUpdate({ _id: req.params.id }, { $inc: { duration: req.body.increment } }, {new: true })
      .then(queue=>{
          if(queue){
            res.json({
                queue
            })
          } else {
              next({
                  status: 404,
                  message: 'Queue Not Found'
              })
          }
      })
  }

  
  static async create(req,res,next){
    try{
      //handle problem
      const foundProblem = await Problem.findOne({
        _id: req.body.problem
      })
      const problem = req.body.problem
      const duration = foundProblem.duration
      
      
      //handle checkin time
      const lastQueue = await QueueLog.findOne().sort({'createdAt' : -1})
      let today = new Date()
      let checkIn = new Date()
      
      if(!lastQueue){
        if(today.getHours() >=6 && today.getMinutes() >= 30){
          checkIn = delayCheckIn(today, 30)
        } else {
          checkIn.setHours(7)
          checkIn.setMinutes(0)
          checkIn.setSeconds(0)
        }
      } else {
        checkIn.setTime(lastQueue.checkIn.getTime() + (foundProblem.duration*60000))
       
      }   

      
      const companyId = req.decode._id
      const userId = req.params.userId
        
      const newData = {
        companyId,
        userId,
        problem,
        duration,
        checkIn
      }

      const newQueue = await QueueLog.create({
            companyId,
            userId,
            problem,
            duration,
            checkIn
        })
        console.log(newQueue)
        res.status(201).json(newQueue)
      } catch(err) {
      next(err)
    }
    
    

  }

  
}

module.exports = QueueLogController