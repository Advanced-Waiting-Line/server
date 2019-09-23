const { RESTDataSource } = require('apollo-datasource-rest')
class QueueAPI extends RESTDataSource {
    constructor() {
      super();
      this.baseURL = 'http://localhost:3000/queueLogs/';
    }
  
    async getAllCompanyQueue(token, id) {
      const response = await this.get(`${id}`, null, 
            {
                headers:{
                token
            }
        });
        console.log(response) 
        let result = response.map(queue=> this.queueReducer(queue))
        return result
    }

    queueReducer(queue){
        return {
            _id: queue._id,
          companyId: {
            _id: queue.companyId._id,
            openTime: queue.companyId.openTime,
            closeTime: queue.companyId.closeTime,
            location: queue.companyId.location,
            queue: queue.companyId.queue
          },
          userId: {
              _id: queue.userId._id,
              firstName: queue.userId.firstName,
              lastName: queue.userId.lastName,
              email: queue.userId.email,
              location: queue.userId.location
          },
          problem: {
              _id: queue.problem._id,
              companyId: queue.problem.companyId,
              duration: queue.problem.duration,
              name: queue.problem.name
          },
          duration: queue.duration,
          checkIn: queue.checkIn
        }
    }

    async getTodayLog(token, id) {
        const response = await this.get(`todayLog/${id}`, null, 
            {
                headers:{
                token
            }
        });

        let result = response.map(queue=> this.queueReducer(queue))
        return result
    }

    async getOneDayLog(token, id, date, month, year){
        const payload = {
            date,
            month,
            year
        }
        const response = await this.post(`oneDayLog/${id}`, payload, 
            {
                headers:{
                token
            }
        });

        let result = response.map(queue=> this.queueReducer(queue))
        return result
    }

    async createQueue(token, id, userId, problemId){
        const payload = {
            problem: problemId
        }
        const response = await this.post(`${id}/${userId}`, payload, 
            {
                headers:{
                token
            }
        });        
        return this.queueReducer(response)
    }
    
  }


  module.exports = QueueAPI