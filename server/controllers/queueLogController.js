const QueueLog = require('../model/QueueLog')
const Problem = require('../model/Problem')
const delayCheckIn = require('../helpers/checkInModifyer/delayCheckIn')
const Company = require('../model/Company')

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
    .populate('problem')
    .populate('companyId')
    .populate('userId')
    .then(queues=>{
      res.json(queues)
    }).catch(err=>{
      next(err)
    })
  }

  static getTodayLog(req,res,next){
    let today = new Date()
    const start = new Date(today.setHours(6))
    const end = new Date( today.setHours(23))
    QueueLog.find({
      "companyId": req.params.companyId,
      "checkIn": {"$gte": start, "$lt": end}})
      .populate('problem')
    .populate('companyId')
    .populate('userId')
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
    .populate('problem')
    .populate('companyId')
    .populate('userId')
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
    const  options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    try{
      //handle problem
      const foundProblem = await Problem.findOne({
        _id: req.body.problem,
        companyId: req.decode._id
      })
      if(!foundProblem){
        next({
          code: 404,
          message: "problem doesn't exist"
        })
      }
      const problem = req.body.problem
      const duration = foundProblem.duration


      //handle company

      const currentCompany = await Company.findOne({
        _id: req.decode._id
      })
      //handle open & close time
      let today = new Date()
      console.log(today.toLocaleDateString("en-US", options), "current time in local <<<")
      const openHour = currentCompany.openTime.getHours()
      const openMinute = currentCompany.openTime.getMinutes()

      const closeHour = currentCompany.closeTime.getHours()
      const closeMinute = currentCompany.closeTime.getMinutes()

      const openTime = new Date(today.setHours(openHour))
      openTime.setMinutes(openMinute)

      const closeTime = new Date(today.setHours(closeHour))
      closeTime.setMinutes(closeMinute)

      

      //handle checkin time
      let checkIn = new Date()
      today = new Date()
      const start = new Date(today.setHours(6))
      const end = new Date(today.setHours(23))
    
      const lastQueue = await QueueLog
        .findOne({
          "companyId": req.params.companyId,
          "checkIn": {"$gte": start, "$lt": end}})          
        .sort({createdAt: 'descending'})
        .populate('problem')

      today = new Date()

      if(!lastQueue){
        if(today >= (openTime - 30*600000)){
          checkIn = delayCheckIn(today, 30)
        
        } else {

          checkIn.setHours(openHour)
          checkIn.setMinutes(openMinute)
          checkIn.setSeconds(0)
        }
      } else {
        let latestSolved = new Date(lastQueue.checkIn.getTime() + (lastQueue.problem.duration*60000))
        if(latestSolved > closeTime ){
          next({
            code: 403,
            message: "the queue already beyond closing time"
          })
        }
        checkIn.setTime(lastQueue.checkIn.getTime() + (foundProblem.duration*60000))
        
      console.log(lastQueue.checkIn.toLocaleDateString("en-US", options), "latest checkin time in local <<<")
      console.log(latestSolved.toLocaleDateString("en-US", options), "latest solved time in local <<<")
      }   

      today = new Date()

      if(checkIn > closeTime ){
        next({
          code: 403,
          message: "the queue already beyond closing time"
        })
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
      
      console.log(openTime.toLocaleDateString("en-US", options), "open time in local <<<")
      console.log(closeTime.toLocaleDateString("en-US", options), "close time in local <<<")
      console.log(today.toLocaleDateString("en-US", options), "current time in local <<<")
      console.log(checkIn.toLocaleDateString("en-US", options), "checkin time in local <<<")

      const newQueue = await QueueLog.create({
            companyId,
            userId,
            problem,
            duration,
            checkIn
      })
      
      if(newQueue){
        const pushedQueue = await Company.updateOne(
        {
          _id: req.decode._id
        }, 
        {
          $push:{
            queue: newQueue._id
          }
        },
          {new: true}
        )
        console.log(pushedQueue)
      }

      res.status(201).json(newQueue)
      // res.send('ok')
    } catch(err) {
      next(err)
    }
    
    

  }


  static async updateDuration(req,res,next){
    const {duration} = req.body
    const currentQueue = await QueueLog.findOne({
      _id: req.params.queueLogId
    })
    let currentCheckIn = new Date(currentQueue.checkIn)    

    const end = new Date(currentCheckIn.getTime())
    end.setHours(23)
    const nextQueue = await QueueLog
      .find({
        companyId: req.decode._id,
        checkIn: {"$gte": currentCheckIn, "$lt": end}
      })         
      
      nextQueue.forEach( async queue => {
        await QueueLog.updateOne({
          _id : queue._id
        },{
          $set:{ 
            checkIn: new Date(queue.checkIn.getTime() + (duration*60000))
          }
        })
      });

      res.send('ok')
    
  }

  
}

module.exports = QueueLogController