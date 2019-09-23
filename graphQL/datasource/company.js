const { RESTDataSource } = require('apollo-datasource-rest')
class CompanyAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:3000/companies/';
  }

  async getAllCompany() {
    const companies = await this.get(`findAll`);
    return companies
  }
    
}

module.exports = CompanyAPI