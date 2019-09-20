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
        res.json({
            queues
        })
    })
  }

  static addDuration(req,res,next){
    Queue.findOneAndUpdate({ _id: res._id }, { $inc: { duration: req.body.increment } }, {new: true })
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

  static async create(req,res,next){
    try{
      const foundProblem = await Problem.findOne({
        _id: req.body.problem
      })

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
        checkIn.setTime(lastQueue.checkIn.getTime() + (problem.duration*60000))
        console.log(checkIn) 
      }
      // console.log(checkIn, "<<<")
      // if(lastQueue){
      //     checkIn.setTime(checkIn.getTime() + (30*60000))
      //     console.log(checkIn)   
      // console.log('ada lastqueue')  
      // }    
      // // const {companyId, userId} = req.params
      // const companyId = '5d838bb17679a81c797c7ccd'
      // const userId = '5d838bb17679a81c797c7ccd'
      // const problem = '5d838bb17679a81c797c7ccd'
      // const duration = problem.duration
      
      // const newData = {
      //   companyId,
      //   userId,
      //   problem,
      //   duration,
      //   checkIn
      // }

      // console.log(newData)
      // const newQueue = await QueueLog.create({
      //     companyId,
      //     userId,
      //     problem,
      //     duration,
      //     checkIn
      // })
      // console.log(newQueue)

    } catch(err) {
      next(err)
    }
    
    

  }

  
}

module.exports = QueueLogController