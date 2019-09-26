const QueueLog = require('../model/QueueLog')
const Problem = require('../model/Problem')
const delayCheckIn = require('../helpers/checkInModifyer/delayCheckIn')
const calcAvg = require('../helpers/calcAvg')
const Company = require('../model/Company')
const  options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
const db = require('../extend appjs/firestore')

class QueueLogController {
  // static findAll(req,res,next){
  //   QueueLog.find({})
  //   .populate('problem')
  //   .populate('companyId')
  //   .populate('userId')
  //   .then(queues=>{
  //       res.json(queues)
  //   })
  // }

  static async getWeeklyPercentage(req,res,next){
    try{
      const today = new Date()
      today.setHours(23)
      today.setMinutes(59)
  
      const seventh = new Date(today - 6.048e+8)
      const fourteenth = new Date(today - 1.21e+9)
      console.log(today.toLocaleDateString("en-US", options), "today time in local <<<")
      console.log(seventh.toLocaleDateString("en-US", options), "7th time in local <<<")
      console.log(fourteenth.toLocaleDateString("en-US", options), "14th time in local <<<")
      
      const currentWeek = await QueueLog.find({
        "companyId": req.decode._id,
        "checkIn": {"$gte": seventh, "$lt": today}
      })

      const lastWeek = await QueueLog.find({
        "companyId": req.decode._id,
        "checkIn": {"$gte": fourteenth, "$lt": seventh}
      }) 

      let cw = currentWeek.length
      let lw = lastWeek.length
      console.log(cw, "first week data")
      console.log(lw, "lasta week data")

      let percentage = calcAvg(cw,lw)
      res.json({
        percentage,
        currentWeek :  cw,
        lastWeek : lw
      })
    } catch(err){

    }
  }

  static async getDailyPercentage(req,res,next){
    try{
      const todayEnd = new Date()
      todayEnd.setHours(23)
      todayEnd.setMinutes(59)
  
      const todayStart = new Date(todayEnd - 8.64e+7)
      const yesterday = new Date(todayStart - 8.64e+7)
      console.log(todayStart.toLocaleDateString("en-US", options), "today start in local <<<")
      console.log(todayEnd.toLocaleDateString("en-US", options), "today end in local <<<")
      console.log(yesterday.toLocaleDateString("en-US", options), "yesterday in local <<<")
      
      const thisDay = await QueueLog.find({
        "companyId": req.decode._id,
        "checkIn": {"$gt": todayStart, "$lt": todayEnd}
      })

      const lastDay = await QueueLog.find({
        "companyId": req.decode._id,
        "checkIn": {"$gt": yesterday, "$lt": todayStart}
      }) 

      let cd = thisDay.length
      let ld = lastDay.length
      console.log(cd, "this day data")
      console.log(ld, "last day data")

      let percentage = calcAvg(cd,ld)
      res.json({
        percentage,
        currentDay :  cd,
        lastDay : ld
      })
    } catch(err){      /* istanbul ignore next */
      next(err)
    }
  }

  static getAllCompanyQueueLog(req,res,next){
    QueueLog.find({
      "companyId": req.decode._id})
    .populate('problem')
    .populate('companyId')
    .populate('userId')
    .then(queues=>{
      res.json(queues)
    }).catch(next)
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
    }).catch(next)
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
      console.log('dari controller')
      console.log(queues)
      res.json(queues)
    }).catch(next)
    
  }

  static getQueueByUserId(req,res,next){
    QueueLog.find({
      userId: req.decode._id
    })
    .populate('problem')
    .populate('companyId')
    .sort({createdAt: 'descending'})
    .then(result=>{
      res.json(result)
    })
    .catch(next)
  }

  static async preview(req,res,next){
    try{

      //handle distance location
      let distance = Math.ceil(req.body.distance/60)


      //handle problem
      const foundProblem = await Problem.findOne({
        _id: req.body.problem,
        companyId: req.params.companyId
      })       
      /* istanbul ignore if */
      if(!foundProblem){
         /* istanbul ignore next */
         next({
          status: 404,
          message: "problem doesn't exist"
        })
      }
      const problem = req.body.problem
      const duration = foundProblem.duration


      //handle company

      const currentCompany = await Company.findOne({
        _id: req.params.companyId
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
      const start = new Date(today.setHours(1))
      const end = new Date(today.setHours(23))
    
      const lastQueue = await QueueLog
        .findOne({
          "companyId": req.params.companyId,
          "checkIn": {"$gte": start, "$lt": end}})          
        .sort({createdAt: 'descending'})
        .populate('problem')

      today = new Date()
      /* istanbul ignore next */
      if(!lastQueue){
        if(today >= (openTime - distance*60000)){
          checkIn = delayCheckIn(today, distance)
          
        } else {
          
          checkIn.setHours(openHour)
          checkIn.setMinutes(openMinute)
          checkIn.setSeconds(0)
        }
      } else {
        today = new Date()
        let latestSolved = new Date(lastQueue.checkIn.getTime() + (lastQueue.problem.duration*60000))
        console.log(latestSolved.toLocaleDateString("en-US", options), "latest solved time in local <<<")
        if(lastQueue.checkIn < today){
          checkIn = delayCheckIn(today, distance)
        }else {
          if(latestSolved > closeTime ){
            next({
              code: 403,
              message: "the queue already beyond closing time"
            })
          }
          checkIn.setTime(lastQueue.checkIn.getTime() + (lastQueue.problem.duration*60000))
          today = new Date()
          if((today.getTime()+(distance*60000)) > latestSolved){
            checkIn = delayCheckIn(today, distance)
          }
        }
        
        console.log(distance, "distance")
      console.log(lastQueue.checkIn.toLocaleDateString("en-US", options), "latest checkin time in local <<<")
      }   

      today = new Date()
      /* istanbul ignore next */
      if(checkIn > closeTime ){
        next({
          code: 403,
          message: "the queue already beyond closing time"
        })
      }
      const companyId = req.params.companyId
      const userId = req.decode._id

      console.log(openTime.toLocaleDateString("en-US", options), "open time in local <<<")
      console.log(closeTime.toLocaleDateString("en-US", options), "close time in local <<<")
      console.log(today.toLocaleDateString("en-US", options), "current time in local <<<")
      console.log(checkIn.toLocaleDateString("en-US", options), "checkin time in local <<<")
      
      res.json({
        companyId,
        userId,
        problem,
        duration,
        checkIn
      })

    } catch(err) {
      /* istanbul ignore next */
      next(err)
    }
  }
  
  static async create(req,res,next){
    try{

      //handle distance location
      let distance = Math.ceil(req.body.distance/60)


      //handle problem
      const foundProblem = await Problem.findOne({
        _id: req.body.problem,
        companyId: req.params.companyId
      })
      if(!foundProblem){
        next({
          status: 404,
          message: "problem doesn't exist"
        })
      }
      const problem = req.body.problem
      const duration = foundProblem.duration


      //handle company

      const currentCompany = await Company.findOne({
        _id: req.params.companyId
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
      const start = new Date(today.setHours(1))
      const end = new Date(today.setHours(23))
    
      const lastQueue = await QueueLog
        .findOne({
          "companyId": req.params.companyId,
          "checkIn": {"$gte": start, "$lt": end}})          
        .sort({createdAt: 'descending'})
        .populate('problem')

      today = new Date()
      /* istanbul ignore next */
      if(!lastQueue){
        if(today >= (openTime - distance*60000)){
          checkIn = delayCheckIn(today, distance)
          
        } else {
          
          checkIn.setHours(openHour)
          checkIn.setMinutes(openMinute)
          checkIn.setSeconds(0)
        }
      } else {
        today = new Date()
        let latestSolved = new Date(lastQueue.checkIn.getTime() + (lastQueue.problem.duration*60000))
        console.log(latestSolved.toLocaleDateString("en-US", options), "latest solved time in local <<<")
        if(lastQueue.checkIn < today){
          checkIn = delayCheckIn(today, distance)
        }else {
          if(latestSolved > closeTime ){
            next({
              code: 403,
              message: "the queue already beyond closing time"
            })
          }
          checkIn.setTime(lastQueue.checkIn.getTime() + (lastQueue.problem.duration*60000))
        }
        
        console.log(distance, "distance")
        console.log(lastQueue.checkIn.toLocaleDateString("en-US", options), "latest checkin time in local <<<")
      }   

      today = new Date()
      /* istanbul ignore next */
      if(checkIn > closeTime ){
        next({
          code: 403,
          message: "the queue already beyond closing time"
        })
      }
      
      const companyId = req.params.companyId
      const userId = req.decode._id
             
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
      
      await Company.updateOne(
        {
          _id: req.params.companyId
        }, 
        {
          $addToSet:{
            queue: newQueue._id
          }
        },
        {
          new: true
        }
      )
        
      await db.collection('awansub').add({ awan: true })

      res.status(201).json(newQueue)
    
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

      if(!currentQueue){

        next({})
      }
      let currentCheckIn = new Date(currentQueue.checkIn)    
      
      const end = new Date(currentCheckIn.getTime())
      end.setHours(23)
      const nextQueue = await QueueLog
      .find({
        companyId: req.decode._id,
        checkIn: {"$gt": currentCheckIn, "$lt": end}
      })         
      
      if(nextQueue.length > 0){
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
      await db.collection('awansub').add({ awan: true })

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

      const updateStatus = await QueueLog.updateOne({
        _id: req.params.queueLogId
      },{
        $set:{
          status: true
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

      console.log(new Date().toLocaleDateString("en-US", options), "current time in local <<<")
      console.log(currentCheckIn.toLocaleDateString("en-US", options), "checkin time in local <<<")

      const currentEnd = new Date(currentCheckIn.getTime() + (currentQueue.problem.duration*60000))
      console.log(currentEnd.toLocaleDateString("en-US", options), "current queue end time in local <<<")

      if(nextQueue.length > 0){
        console.log(nextQueue[0].checkIn.toLocaleDateString("en-US", options), "next checkin time in local <<<")
        let today = new Date()
        let adjusted = new Date(nextQueue[0].checkIn - ((nextQueue[0].checkIn.getTime()) - today))
        console.log(adjusted)
        console.log(adjusted.toLocaleDateString("en-US", options), "adjusted time in local <<<")
        let currentTime = new Date()
        /* istanbul ignore next */
        if(currentTime >= currentCheckIn){
          if(currentTime >= currentEnd){
            
          } else {
            let adjustingTime = (nextQueue[0].checkIn.getTime()) - currentTime
            nextQueue.forEach( async queue => {
              await QueueLog.updateOne({
                _id : queue._id
              },{
                $set:{ 
                  checkIn: new Date(queue.checkIn.getTime() - (adjustingTime))
                }
              })
            });

          }
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

      await db.collection('awansub').add({ awan: true })
         
      res.status(200).json({
        message: "queue removed from list"
      })

    } catch(err){
      next(err)
    }
  }

  static async updateStatus(req,res,next){
    const currentQueue = await QueueLog.findOne({
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
      .then(async result=>{
        await db.collection('awansub').add({ awan: true })
        res.json({
          message: `status updated to ${!currentQueue.status}`
        })
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