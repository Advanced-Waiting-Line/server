const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect;
const app = require('../app')
const clearDatabase = require('../helpers/test/clearDatabase')

chai.use(chaiHttp);

after(function(done){
  console.log('database QueueLog cleared')
  clearDatabase(done)
})
let idUser
//========== QueueLog Test ==========
describe(`queue test`, function(){
  describe('GET /queueLogs/', function(){
    it('Success get all queueLog data with status 200', function (done){
      chai
      .request(app)
      .get('/queueLogs/')
      .end(function(err,res){
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.an("array")
        done()
      })
    })
  })

  // describe('GET /queueLogs/', function(){
  //   it('Success get all queueLog data with status 200', function (done){
  //     let logDate = new Date()
  //     logDate.setDate(req.body.date)
  //     logDate.setMonth(req.body.month)
  //     logDate.setFullYear(req.body.year)
      
  //     chai
  //     .request(app)
  //     .get('/users/register')
  //     .send(user)
  //     .end(function(err,res){
  //       idUser = res.body._id
  //       expect(err).to.be.null
  //       expect(res).to.have.status(201)
  //       expect(res.body).to.be.an("object")
  //       // expect(res.body.firstName).to.equal("lorem")
  //       expect(res.body.lastName).to.equal("ipsum")
  //       expect(res.body.email).to.equal("qwer@mail.com")
  //       expect(res.body.password).to.not.equal("qwerqwer")
  //       expect(res.body).to.have.keys(['_id', 'firstName', 'lastName', 'email', "password", "createdAt", "updatedAt", "__v"])
  //       done()
  //     })
  //   })
  // })

})