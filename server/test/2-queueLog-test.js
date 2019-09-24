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

let userId
let userToken
let companyId
let companyToken
let problemId
let queueLogId

// Get Id User
describe('POST /users/register', function(){
  this.timeout(10000)
  it('Success register user with status 201', function (done){
    let user = {
      firstName: "lorem ",
      lastName: "ipsum",
      image: process.env.IMAGE_BASE64,
      email: "abcd@mail.com",
      password: "qwerqwer",
      location: {
        lat: -6.260181,
        lng: 106.780505,
       },
    }
    chai
    .request(app)
    .post('/users/register')
    .send(user)
    .end(function(err,res){
      userId = res.body._id
      expect(err).to.be.null
      expect(res).to.have.status(201)
      expect(res.body).to.be.an("object")
      expect(res.body.password).to.not.equal("qwerqwer")
      expect(res.body).to.have.keys(['_id', 'firstName', 'lastName', 'location','image', 'email', "password", "createdAt", "updatedAt", "__v"])
      done()
    })
  })
})

// Get Id Company
describe('POST /companies/register', function(){
  this.timeout(10000)
  it('Sucess register company with status 201', function (done){
    let company = {
      openTime: "Wed Oct 18 2017 00:41:34 GMT+0000 (UTC)",
      closeTime: "Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)",
      location: {
        lat: -6.260181,
        lng: 106.780505,
      },
      image: process.env.IMAGE_BASE64,
      email: "abcd@mail.com",
      password: "qwerqwer",
      queue: [],
    }
    chai
    .request(app)
    .post('/companies/register')
    .send(company)
    .end(function(err,res){
      companyId = res.body._id
      expect(err).to.be.null
      expect(res).to.have.status(201)
      expect(res.body).to.be.an("object")
      // expect(res.body.openTime).to.equal("Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)")
      expect(res.body.password).to.not.equal("qwerqwer")
      expect(res.body).to.have.keys(['_id', 'openTime', "closeTime", 'location', "image", "email", "password", "queue", "createdAt", "updatedAt", "__v"])
      done()
    })
  })
})

// Get Token User
describe("POST /users/login", function () {
  this.timeout(10000)
  it("Success login with status 200", function (done) {
    let user = {
      email: "abcd@mail.com",
      password: "qwerqwer"
    };
    chai
      .request(app)
      .post("/users/login")
      .send(user)
      .end(function (err, res) {
        userToken = res.body.token
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("_id","email", "token")
        done();
      })
  })
})



//========== Get Company Token ==========
describe("POST /companies/login", function () {
  this.timeout(10000)
  it("Success login company with status 200", function (done) {
    let company = {
      email: "abcd@mail.com",
      password: "qwerqwer"
    };
    chai
      .request(app)
      .post("/companies/login")
      .send(company)
      .end(function (err, res) {
        companyToken = res.body.token
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("_id", "token", "email")
        done();
      })
  })
})

//========== Create Problem ==========
describe("POST /problems", function () {
  this.timeout(10000)
  it("Success create prolem with status 201", function (done) {
    let input = {
      name: "abcd@mail.com",
      duration: 2,
      description: "test description"
    };
    chai
      .request(app)
      .post("/problems")
      .set('token', companyToken)
      .send(input)
      .end(function (err, res) {
        problemId =  res.body._id
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("_id", "name", "description", "duration", "companyId", "__v")
        done();
      })
  })
})

//========== QueueLog Test ==========
describe(`queue test`, function(){
  this.timeout(10000)
  // describe('GET /queueLogs/', function(){
  //   it('Success get all queueLog data with status 200', function (done){
  //     console.log('ini tokennya', companyToken)
  //     chai
  //     .request(app)
  //     .set('token', companyToken)
  //     .get('/queueLogs/')
  //     .end(function(err,res){
  //       // expect(err).to.be.null
  //       // expect(res).to.have.status(200)
  //       // expect(res.body).to.be.an("array")
  //       done()
  //     })
  //   })
  // })

  describe('GET /queueLogs', function(){
    it('Success get all queueLog based on companyId with status 200', function (done){
      chai
      .request(app)
      .get(`/queueLogs`)
      .set('token', companyToken)
      .end(function(err,res){
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.an("array")
        done()
      })
    })
    it('Should throw error when getting all queue log with invalid token', function (done){
      chai
      .request(app)
      .get(`/queueLogs`)
      .set('token', "invalidtokenformat")
      .end(function(err,res){
        expect(res).to.have.status(500)
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("message","code")
        done()
      })
    })
    it('Should throw error when getting all queue log with no token', function (done){
      chai
      .request(app)
      .get(`/queueLogs`)
      .end(function(err,res){
        expect(res).to.have.status(401)
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("message", "code")
        done()
      })
    })
  })

  describe('GET /queueLogs/todayLog', function(){
    it('Success get all queueLog for today based on companyId with status 200', function (done){
      chai
      .request(app)
      .get(`/queueLogs/todayLog`)
      .set('token', companyToken)
      .end(function(err,res){
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.an("array")
        done()
      })
    })
  })

  describe('GET /queueLogs/user', function(){
    it('Success get all queueLog for today based on userId with status 200', function (done){
      chai
      .request(app)
      .get(`/queueLogs/user`)
      .set('token', userToken)
      .end(function(err,res){
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.an("array")
        done()
      })
    })
  })

  describe('POST /queueLogs/oneDayLog', function(){
    it('Success get all queueLog for based on date and companyId with status 200', function (done){
      let date = {
        date: "23",
        month: "8",
        year: "2019"
      };
      chai
      .request(app)
      .post(`/queueLogs/oneDayLog`)
      .send(date)
      .set('token', companyToken)
      .end(function(err,res){
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.an("array")
        done()
      })
    })
  })

  describe('POST /queueLogs/:companyId', function(){
    it('Create queueLog with status 201', function (done){

      let input = {
        problem: problemId, // Cari ID
      };
      chai
      .request(app)
      .post(`/queueLogs/${companyId}`)
      .send(input)
      .set('token', userToken)
      .end(function(err,res){
        queueLogId = res.body._id
        expect(err).to.be.null
        expect(res).to.have.status(201)
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("_id","companyId", "userId", "duration", "problem", "checkIn", "status", "createdAt", "updatedAt")
        done()
      })
    })

    it('Create second queueLog with status 201', function (done){

      let input = {
        problem: problemId, // Cari ID
      };
      chai
      .request(app)
      .post(`/queueLogs/${companyId}`)
      .send(input)
      .set('token', userToken)
      .end(function(err,res){
        expect(err).to.be.null
        expect(res).to.have.status(201)
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("_id","companyId", "userId", "duration", "problem", "checkIn", "status", "createdAt", "updatedAt")
        // expect(res.body.status).to.equal(false)
        done()
      })
    })

    it('Should error when Create queueLog with invalid problem', function (done){

      let input = {
        problem: "5d847d34b203fa4684aaaaaa", // Cari ID
      };
      chai
      .request(app)
      .post(`/queueLogs/${companyId}`)
      .send(input)
      .set('token', userToken)
      .end(function(err,res){
        expect(res).to.have.status(404)
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("message","code")
        done()
      })
    })

    it('Should error when Create queueLog with invalid companyId', function (done){

      let input = {
        problem: problemId, // Cari ID
      };
      chai
      .request(app)
      .post(`/queueLogs/${"5d847d34b203fa4684aaaaaa"}`)
      .send(input)
      .set('token', userToken)
      .end(function(err,res){
        expect(res).to.have.status(404)
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("message", "code")
        done()
      })
    })
    
    it('Should error when Create queueLog with invalid token', function (done){

      let input = {
        problem: problemId, // Cari ID
      };
      chai
      .request(app)
      .post(`/queueLogs/${"5d847d34b203fa4684aaaaaa"}`)
      .send(input)
      .set('token', "invalid token")
      .end(function(err,res){
        expect(res).to.have.status(500)
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("message", "code")
        done()
      })
    })

    it('Should error when Create queueLog with no token', function (done){

      let input = {
        problem: problemId, // Cari ID
      };
      chai
      .request(app)
      .post(`/queueLogs/${"5d847d34b203fa4684aaaaaa"}`)
      .send(input)
      .end(function(err,res){
        expect(res).to.have.status(401)
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("message","code")
        done()
      })
    })

  })

  describe('PUT /queueLogs/duration/:queueLogId', function(){
    it('Update queue duration', function (done){
      let input = {
        duration: 5
      };
      chai
      .request(app)
      .put(`/queueLogs/duration/${queueLogId}`)
      .send(input)
      .set('token', companyToken)
      .end(function(err,res){
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("message")
        done()
      })
    })
    it(' should error when Updating queue duration with invalid queueId', function (done){
      chai
      .request(app)
      .put(`/queueLogs/duration/${"5d847d34b203fa4684aaaaaa"}`)
      .set('token', companyToken)
      .end(function(err,res){
        expect(res).to.have.status(500)
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("message","code")
        done()
      })
    })
  })

  describe('PUT /queueLogs/remove/:queueLogId', function(){
    it('Update removing queue from the line', function (done){
      chai
      .request(app)
      .put(`/queueLogs/remove/${queueLogId}`)
      .set('token', companyToken)
      .end(function(err,res){
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.an("object")
        // expect(res.body).to.have.keys("message")
        done()
      })
    })
    it('should error when removing queue from the line with invalid queuelogId', function (done){
      chai
      .request(app)
      .put(`/queueLogs/remove/${"5d847d34b203fa4684aaaaaa"}`)
      .set('token', companyToken)
      .end(function(err,res){
        expect(res).to.have.status(500)
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("message", "code")
        done()
      })
    })

    
  })

  describe('PUT /queueLogs/status/:queueLogId', function(){
    it('Update queue duration', function (done){
      chai
      .request(app)
      .put(`/queueLogs/status/${queueLogId}`)
      .set('token', companyToken)
      .end(function(err,res){
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.an("object")
        // expect(res.body).to.have.keys("message")
        done()
      })
    })

    it('Should error when updating queue duration with invalid queueId', function (done){
      chai
      .request(app)
      .put(`/queueLogs/status/${"5d847d34b203fa4684aaaaaa"}`)
      .set('token', companyToken)
      .end(function(err,res){
        expect(res).to.have.status(404)
        expect(res.body).to.be.an("object")
        expect(res.body).to.have.keys("message", "code")
        done()
      })
    })
  })

})