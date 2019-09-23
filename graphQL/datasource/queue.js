const { RESTDataSource } = require('apollo-datasource-rest')
class QueueAPI extends RESTDataSource {
    constructor() {
      super();
      this.baseURL = 'http://localhost:3000/queueLogs/';
    }
  
    async getAllCompanyQueue(token) {
      const response = await this.get(``, null, 
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
          checkIn: queue.checkIn,
          status: queue.status
        }
    }

    async getTodayLog(token) {
        const response = await this.get(`todayLog`, null, 
            {
                headers:{
                token
            }
        });

        let result = response.map(queue=> this.queueReducer(queue))
        return result
    }

    async getOneDayLog(token, date, month, year){
        const payload = {
            date,
            month,
            year
        }
        const response = await this.post(`oneDayLog`, payload, 
            {
                headers:{
                token
            }
        });

        let result = response.map(queue=> this.queueReducer(queue))
        return result
    }

    async getQueueByUserId(token){
        const response = await this.get(`user`, null,
            {
                headers:{
                token
            }
        });

        console.log(response)

        let result = response.map(queue=> this.queueReducer(queue))
        return result
    }

    async createQueue(token, id, problemId){
        const payload = {
            problem: problemId
        }
        const response = await this.post(`${id}`, payload, 
            {
                headers:{
                token
            }
        });        
        return this.queueReducer(response)
    }

    async updateDurationQueue(token, queueId, duration){
        const payload = {
            duration
        }
        const response = await this.put(`duration/${queueId}`, payload, 
            {
                headers:{
                token
            }
        });        
        return {
            message : response.message
        }
    }
    async removeFromQueue(token, queueId){
        const response = await this.put(`remove/${queueId}`, null, 
            {
                headers: {
                token
            }
        })
        return {
            message: response.message
        }
    }

    async updateStatus(token, queueId){
        const response = await this.put(`status/${queueId}`, null, 
            {
                headers: {
                token
            }
        })
        return {
            message: response.message
        }
    }   
  }


  module.exports = QueueAPI