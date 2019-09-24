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

  async findCompanyById(id){
    const company = await this.get(`findOne/${id}`)
    return company
  }
    
}

module.exports = CompanyAPI