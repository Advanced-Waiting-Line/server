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
        let result = response.map(queue=> this.queueReducer(queue))
        return result
    }

    queueReducer(queue){
        return {
            _id: queue._id,
          companyId: queue.companyId,
          userId: queue.userId,
          problem: queue.problem,
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