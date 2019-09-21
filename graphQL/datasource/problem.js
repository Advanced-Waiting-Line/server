const { RESTDataSource } = require('apollo-datasource-rest')
class ProblemAPI extends RESTDataSource {
    constructor() {
      super();
      this.baseURL = 'http://localhost:3000/problems/';
    }
  
    async getCompanyProblem(id) {
      const response = await this.get(`${id}`);
        let result = response.map(problem=> this.problemReducer(problem))
        return result
    }

    async createProblem(token, name, duration){
        const payload = {
            name,
            duration
        }
        const response = await this.post(``,payload, {
            headers: {
                token
            }
        })

        return this.problemReducer(response)
    }

    async updateProblem(token, problemId, name, duration){
        const payload = {
            name,
            duration
        }
        const response = await this.put(`${problemId}`,payload, {
            headers: {
                token
            }
        })
        console.log(response)

        return this.problemReducer(response)
    }

    async deleteProblem(token, problemId){
        const response = await this.delete(`${problemId}`, null, {
            headers: {
                token
            }
        })

        return this.problemReducer(response)
    }

    problemReducer(problem){
        return {
            _id: problem._id,
          companyId: problem.companyId,
          name: problem.name,
          duration: problem.duration,
        }
    }
    
  }


  module.exports = ProblemAPI