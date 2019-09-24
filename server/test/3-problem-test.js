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
      email: "efgh@mail.com",
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
      openTime: "Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)",
      closeTime: "Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)",
      location: {
        lat: -6.260181,
        lng: 106.780505,
      },
      image: process.env.IMAGE_BASE64,
      email: "efgh@mail.com",
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
      email: "efgh@mail.com",
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
      email: "efgh@mail.com",
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

//========== QueueLog Test ==========
describe(`queue test`, function(){
  this.timeout(10000)
  // describe("GET /problems", function () {
  //   it("Success create prolem with status 201", function (done) {
  //     chai
  //       .request(app)
  //       .get("/problems")
  //       .end(function (err, res) {
  //         problemId =  res.body._id
  //         expect(err).to.be.null;
  //         expect(res).to.have.status(200);
  //         expect(res.body).to.be.an("array")
  //         done();
  //       })
  //   })
  // })

  describe("GET /:companyId", function () {
    it("Success get prolem by company id with status 200", function (done) {
      chai
        .request(app)
        .get(`/problems/${companyId}`)
        .set('token', companyToken)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array")
          done();
        })
    })
    it("Error when get prolem by company id with invalid companyId", function (done) {
      chai
        .request(app)
        .get(`/problems/${"invalidId"}`)
        .set('token', companyToken)
        .end(function (err, res) {
          expect(res).to.have.status(500)
          expect(res.body).to.be.an("object")
          expect(res.body).to.have.keys("message", "code")
          done()
        })
    })
  })

  describe("POST /problems", function () {
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

  describe("PUT /problems/:problemId", function () {
    it("Success update prolem with status 200", function (done) {
      let input = {
        name: "abcd@mail.com",
        duration: 2,
        description: "test description"
      };
      chai
        .request(app)
        .put(`/problems/${problemId}`)
        .set('token', companyToken)
        .send(input)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object")
          // expect(res.body).to.have.keys("_id", "name", "description", "duration", "companyId", "__v")
          done();
        })
    })
  })

  describe("DELETE /problems/:problemId", function () {
    it("Success update prolem with status 200", function (done) {
      chai
        .request(app)
        .delete(`/problems/${problemId}`)
        .set('token', companyToken)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object")
          // expect(res.body).to.have.keys("_id", "name", "description", "duration", "companyId", "__v")
          done();
        })
    })
  })
})