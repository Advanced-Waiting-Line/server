const { RESTDataSource } = require('apollo-datasource-rest')
class UserAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:3000/users/';
  }

  async findOneUser(id) {
    const user = await this.get(`${id}`);
    return user
  }
    
}

module.exports = UserAPI