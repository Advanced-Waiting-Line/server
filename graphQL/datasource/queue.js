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
          companyId: queue.companyId,
          userId: queue.userId,
          problem: queue.problem,
          duration: queue.duration,
          checkIn: queue.checkIn
        }
    }
  }


  module.exports = QueueAPI