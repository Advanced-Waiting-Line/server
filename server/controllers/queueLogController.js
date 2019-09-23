const QueueLog = require('../model/QueueLog')
const Problem = require('../model/Problem')
const delayCheckIn = require('../helpers/checkInModifyer/delayCheckIn')
const Company = require('../model/Company')
const  options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };

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
      "companyId": req.decode._id})
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
      "companyId": req.decode._id,
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
      "companyId": req.decode._id,
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
  
  static async create(req,res,next){
    console.log(req.decode)
    try{
      //handle problem
      const foundProblem = await Problem.findOne({
        _id: req.body.problem,
        companyId: req.decode._id
      })

      console.log(foundProblem)
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
        today = new Date()
        if(lastQueue.checkIn < today){
          checkIn = delayCheckIn(today, 30)
        }else {
          let latestSolved = new Date(lastQueue.checkIn.getTime() + (lastQueue.problem.duration*60000))
          console.log(latestSolved.toLocaleDateString("en-US", options), "latest solved time in local <<<")
          if(latestSolved > closeTime ){
            next({
              code: 403,
              message: "the queue already beyond closing time"
            })
          }
          checkIn.setTime(lastQueue.checkIn.getTime() + (foundProblem.duration*60000))
        }
        
      console.log(lastQueue.checkIn.toLocaleDateString("en-US", options), "latest checkin time in local <<<")
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
            checkIn,
            status: false
      })
      
      if(newQueue){
        const pushedQueue = await Company.updateOne(
        {
          _id: req.decode._id
        }, 
        {
          $addToSet:{
            queue: newQueue._id
          }
        },
          {new: true}
        )
      }

      res.status(201).json(newQueue)
      // res.send('ok')
    } catch(err) {
      next(err)
    }
    
    

  }


  static async updateDuration(req,res,next){
    try{
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
        checkIn: {"$gt": currentCheckIn, "$lt": end}
      })         
      
      if(nextQueue.length > 0){
        console.log('dapat next')
        nextQueue.forEach( async queue => {
          await QueueLog.updateOne({
            _id : queue._id
          },{
            $set:{ 
              checkIn: new Date(queue.checkIn.getTime() + (duration*60000))
            }
          })
        });
      }
      const addedDuration = await QueueLog.updateOne({
        _id: req.params.queueLogId
      },{
        $inc:{
          duration: duration
        }
      }) 
      res.status(200).json({
        message: "duration updated"
      })

    } catch (err){
      next(err)
    }
    
  }

  static async removeFromQueue(req,res,next){
    try{
      const removedQueue = await Company.updateOne({
        _id: req.decode._id
      },{
        $pull:{
          queue: req.params.queueLogId
        }
      })


      const currentQueue = await QueueLog.findOne({
        _id: req.params.queueLogId
      })
      .populate('problem')

      let currentCheckIn = new Date(currentQueue.checkIn)    
      
      
      const end = new Date(currentCheckIn.getTime())
      end.setHours(23)
      const nextQueue = await QueueLog
        .find({
            companyId: req.decode._id,
            checkIn: {"$gt": currentCheckIn, "$lt": end}
      })    

      if(nextQueue.length > 0){
        console.log(nextQueue[0].checkIn.toLocaleDateString("en-US", options), "next checkin time in local <<<")
        let today = new Date()
        let adjusted = new Date(nextQueue[0].checkIn - ((nextQueue[0].checkIn.getTime()) - today))
        console.log(adjusted)
        console.log(adjusted.toLocaleDateString("en-US", options), "adjusted time in local <<<")
      }
      console.log(new Date().toLocaleDateString("en-US", options), "current time in local <<<")
      console.log(currentCheckIn.toLocaleDateString("en-US", options), "checkin time in local <<<")
      
      
      if(nextQueue.length > 0){
        let currentTime = new Date()
        if(currentTime >= currentCheckIn){
          let adjustingTime = (nextQueue[0].checkIn.getTime()) - currentTime
          console.log(adjustingTime, "adjusting")
          nextQueue.forEach( async queue => {
            await QueueLog.updateOne({
              _id : queue._id
            },{
              $set:{ 
                checkIn: new Date(queue.checkIn.getTime() - (adjustingTime))
              }
            })
          });
        } else {
          const duration = currentQueue.problem.duration

          const end = new Date(currentCheckIn.getTime())
          end.setHours(23)

          nextQueue.forEach( async queue => {
            await QueueLog.updateOne({
              _id : queue._id
            },{
              $set:{ 
                checkIn: new Date(queue.checkIn.getTime() - (duration*60000))
              }
            })  
          });
        }        
      }   
      res.status(200).json({
        message: "queue removed from list"
      })

    } catch(err){
      next(err)
    }
  }

  static async updateStatus(req,res,next){
    const currentQueue = QueueLog.findOne({
      _id: req.params.queueLogId
    })

    if(currentQueue){
      QueueLog.updateOne({
        _id: req.params.queueLogId
      },{
        $set:{
          status: !currentQueue.status
        }
      })
      .then(result=>{
        res.json(result)
      })
    } else {
      next({
        code: 404,
        message: 'Queue not found'
      })
    }
  }

  
}

module.exports = QueueLogController